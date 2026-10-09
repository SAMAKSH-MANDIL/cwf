"""
Unit tests for Arbitrum Smart Contract and EVM Service Layer.
Validates:
1. Model registration and metadata storage
2. zkML contribution verification and recording
3. Duplicate contribution rejection
4. False/unverified contribution rejection
5. AI Passport Soulbound reputation progression
"""

import unittest
from blockchain.arbitrum.arbitrum_service import ArbitrumEVMService


class TestArbitrumService(unittest.TestCase):

    def setUp(self):
        self.service = ArbitrumEVMService()
        self.model_id = "Pneumonia-v1"
        self.contributor = "0x71C66336071ffd4e773E34dac3Ca0A6688211eef"
        self.model_hash = "72941edf341cad5ecc1beb97eebad9b3b0dfd76922af6a534d1449ecb065561b"
        self.update_hash = "58d257cebd7b81abb1310b2eedaa36ca3a70190315a94a8a21809620a1b2ffe6"

    def test_model_registration(self):
        """Model registration must create valid entry in ModelRegistry."""
        evt = self.service.register_model(
            model_id=self.model_id,
            initial_hash=self.model_hash,
            storage_cid="ipfs://bafybeicinitialhash",
        )
        self.assertEqual(evt["event"], "ModelRegistered")
        self.assertIn(self.model_id, self.service.models)

    def test_contribution_submission_and_passport_update(self):
        """Valid contribution must record event and increment AI Passport reputation."""
        success, evt = self.service.submit_contribution(
            contributor=self.contributor,
            model_id=self.model_id,
            round_id=1,
            update_hash=self.update_hash,
            proof_hash="0xabcd1234",
            proof_hex="0x123456",
            public_inputs=[1, 2, 3, 4, 5, 6],
            is_proof_valid=True,
        )
        self.assertTrue(success)
        self.assertEqual(evt["event"], "ContributionVerified")

        passport = self.service.get_passport(self.contributor)
        self.assertEqual(passport["verified_contributions"], 1)
        self.assertEqual(passport["training_rounds"], 1)
        self.assertGreater(passport["reputation_score"], 10)

    def test_duplicate_contribution_rejection(self):
        """Submitting twice in the same round must be rejected."""
        self.service.submit_contribution(
            contributor=self.contributor,
            model_id=self.model_id,
            round_id=1,
            update_hash=self.update_hash,
            proof_hash="0xabcd1234",
            proof_hex="0x123456",
            public_inputs=[1, 2, 3, 4, 5, 6],
            is_proof_valid=True,
        )

        dup_success, dup_res = self.service.submit_contribution(
            contributor=self.contributor,
            model_id=self.model_id,
            round_id=1,
            update_hash=self.update_hash,
            proof_hash="0xabcd1234",
            proof_hex="0x123456",
            public_inputs=[1, 2, 3, 4, 5, 6],
            is_proof_valid=True,
        )
        self.assertFalse(dup_success)
        self.assertIn("error", dup_res)

    def test_invalid_proof_rejection(self):
        """Unverified/invalid zkML proof must be rejected."""
        success, res = self.service.submit_contribution(
            contributor="0x90F79bf6EB2c4f870365E785982E1f101E93b906",
            model_id=self.model_id,
            round_id=2,
            update_hash=self.update_hash,
            proof_hash="0x9999",
            proof_hex="0x0000",
            public_inputs=[1, 2, 3, 4, 5, 6],
            is_proof_valid=False,
        )
        self.assertFalse(success)
        self.assertEqual(res["event"], "ContributionRejected")


if __name__ == "__main__":
    unittest.main()
