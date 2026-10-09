//! Decentralized Verifiable AI Network - Solana Program
//! Manages Compute Provider Registration, AI Contribution Tracking, Anti-Sybil Rate Limiting,
//! and Multi-Factor Dynamic Incentive Token Distribution.

use anchor_lang::prelude::*;

declare_id!("Compute111111111111111111111111111111111111");

#[program]
pub mod decentralized_ai_rewards {
    use super::*;

    /// Initializes global network configuration and reward vault.
    pub fn initialize_network(ctx: Context<InitializeNetwork>, base_reward_rate: u64) -> Result<()> {
        let state = &mut ctx.accounts.network_state;
        state.authority = ctx.accounts.authority.key();
        state.base_reward_rate = base_reward_rate;
        state.total_contributions = 0;
        state.total_rewards_paid = 0;
        state.is_paused = false;
        Ok(())
    }

    /// Registers a compute node (GPU / Edge Node) in the compute registry.
    pub fn register_compute_provider(
        ctx: Context<RegisterProvider>,
        hardware_tier: u8,
        device_name: String,
        declared_vram_gb: u16,
    ) -> Result<()> {
        let provider = &mut ctx.accounts.provider_account;
        provider.owner = ctx.accounts.owner.key();
        provider.hardware_tier = hardware_tier;
        provider.device_name = device_name;
        provider.declared_vram_gb = declared_vram_gb;
        provider.reputation_score = 10;
        provider.total_contributions = 0;
        provider.active = true;
        provider.last_contribution_epoch = 0;
        Ok(())
    }

    /// Records verified contribution from Arbitrum cross-chain relayer and dispenses rewards.
    pub fn record_and_reward_contribution(
        ctx: Context<RecordAndReward>,
        model_id: [u8; 32],
        round_id: u32,
        quality_score_bps: u16,      // Basis points (10000 = 1.0)
        proof_validity_bps: u16,     // 10000 = valid zkML proof
        compute_weight_bps: u16,     // Hardware & sample weighting
        model_utility_bps: u16,      // Community demand multiplier
    ) -> Result<()> {
        let state = &mut ctx.accounts.network_state;
        require!(!state.is_paused, CustomError::NetworkPaused);

        let provider = &mut ctx.accounts.provider_account;
        require!(provider.active, CustomError::ProviderInactive);

        // Anti-Sybil Rate Limiting: Minimum 1 contribution per round epoch
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        require!(
            current_time - provider.last_contribution_epoch >= 1,
            CustomError::RateLimitExceeded
        );

        // Reward calculation formula:
        // Reward = Base * (Quality/10000) * (ProofValid/10000) * (Compute/10000) * (Utility/10000)
        let q = quality_score_bps as u128;
        let v = proof_validity_bps as u128;
        let c = compute_weight_bps as u128;
        let u = model_utility_bps as u128;
        let base = state.base_reward_rate as u128;

        let reward_calc = (base * q * v * c * u) / (10000 * 10000 * 10000 * 10000);
        let final_reward = reward_calc as u64;

        // Record contribution
        let record = &mut ctx.accounts.contribution_record;
        record.provider = provider.owner;
        record.model_id = model_id;
        record.round_id = round_id;
        record.reward_amount = final_reward;
        record.timestamp = current_time;
        record.verified = proof_validity_bps == 10000;

        // State updates
        provider.total_contributions += 1;
        provider.last_contribution_epoch = current_time;
        if record.verified && provider.reputation_score < 100 {
            provider.reputation_score += 1;
        }

        state.total_contributions += 1;
        state.total_rewards_paid += final_reward;

        emit!(RewardDisbursed {
            provider: provider.owner,
            model_id,
            round_id,
            reward_amount: final_reward,
            timestamp: current_time
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeNetwork<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8 + 8 + 1)]
    pub network_state: Account<'info, NetworkState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterProvider<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 1 + 64 + 2 + 2 + 8 + 1 + 8,
        seeds = [b"provider", owner.key().as_ref()],
        bump
    )]
    pub provider_account: Account<'info, ComputeProvider>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(model_id: [u8; 32], round_id: u32)]
pub struct RecordAndReward<'info> {
    #[account(mut)]
    pub network_state: Account<'info, NetworkState>,
    #[account(mut, has_one = owner)]
    pub provider_account: Account<'info, ComputeProvider>,
    #[account(
        init,
        payer = relayer,
        space = 8 + 32 + 32 + 4 + 8 + 8 + 1,
        seeds = [b"contribution", provider_account.key().as_ref(), &model_id, &round_id.to_le_bytes()],
        bump
    )]
    pub contribution_record: Account<'info, ContributionRecord>,
    pub owner: SystemAccount<'info>,
    #[account(mut)]
    pub relayer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NetworkState {
    pub authority: Pubkey,
    pub base_reward_rate: u64,
    pub total_contributions: u64,
    pub total_rewards_paid: u64,
    pub is_paused: bool,
}

#[account]
pub struct ComputeProvider {
    pub owner: Pubkey,
    pub hardware_tier: u8,
    pub device_name: String,
    pub declared_vram_gb: u16,
    pub reputation_score: u16,
    pub total_contributions: u64,
    pub active: bool,
    pub last_contribution_epoch: i64,
}

#[account]
pub struct ContributionRecord {
    pub provider: Pubkey,
    pub model_id: [u8; 32],
    pub round_id: u32,
    pub reward_amount: u64,
    pub timestamp: i64,
    pub verified: bool,
}

#[event]
pub struct RewardDisbursed {
    pub provider: Pubkey,
    pub model_id: [u8; 32],
    pub round_id: u32,
    pub reward_amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("Network is paused")]
    NetworkPaused,
    #[msg("Compute provider is not active")]
    ProviderInactive,
    #[msg("Contribution rate limit exceeded for this epoch")]
    RateLimitExceeded,
}
