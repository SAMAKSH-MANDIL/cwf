"""
Unit tests for zkML Prover and Verifier Pipeline.
Validates:
1. Proof generation and successful verification
2. Tampered proof payload rejection
3. Wrong model hash rejection
4. Wrong update hash rejection
5. Wrong round ID rejection
"""

import unittest
from zkml.model.zkml_engine import ZkMLProverEngine, BN254_PRIME


class TestZkMLPipeline(unittest.TestCase):

    def setUp(self):
        self.prover = ZkMLProverEngine(circuit_onnx_path="./zkml/circuits/diagnostic_net.onnx")
        self.base_hash = "72941edf341cad5ecc1beb97eebad9b3b0dfd76922af6a534d1449ecb065561b"
        self.update_hash = "58d257cebd7b81abb1310b2eedaa36ca3a70190315a94a8a21809620a1b2ffe6"
        self.round_id = 1
        self.client_address = "0x71C66336071ffd4e773E34dac3Ca0A6688211eef"
        self.sample_in = [0.5] * 16
        self.sample_out = [1.2, -0.8]

    def test_valid_proof_generation_and_verification(self):
        """Valid proof must verify successfully."""
        result = self.prover.generate_proof(
            base_model_hash=self.base_hash,
            update_hash=self.update_hash,
            round_id=self.round_id,
            client_address=self.client_address,
            sample_input=self.sample_in,
            sample_output=self.sample_out,
        )

        self.assertIn("proof_hex", result)
        self.assertIn("proof_hash", result)
        self.assertEqual(len(result["public_inputs_decimal"]), 6)

        is_valid, msg = self.prover.verify_proof(
            proof_hex=result["proof_hex"],
            public_inputs=result["public_inputs_decimal"],
            expected_model_hash=self.base_hash,
            expected_update_hash=self.update_hash,
            expected_round_id=self.round_id,
        )
        self.assertTrue(is_valid, f"Verification failed: {msg}")

    def test_wrong_model_hash_rejection(self):
        """Tampered model hash must fail verification."""
        result = self.prover.generate_proof(
            base_model_hash=self.base_hash,
            update_hash=self.update_hash,
            round_id=self.round_id,
            client_address=self.client_address,
            sample_input=self.sample_in,
            sample_output=self.sample_out,
        )
        fake_model_hash = "0000000000000000000000000000000000000000000000000000000000000000"

        is_valid, msg = self.prover.verify_proof(
            proof_hex=result["proof_hex"],
            public_inputs=result["public_inputs_decimal"],
            expected_model_hash=fake_model_hash,
            expected_update_hash=self.update_hash,
            expected_round_id=self.round_id,
        )
        self.assertFalse(is_valid)
        self.assertIn("Model hash mismatch", msg)

    def test_wrong_update_hash_rejection(self):
        """Tampered update hash must fail verification."""
        result = self.prover.generate_proof(
            base_model_hash=self.base_hash,
            update_hash=self.update_hash,
            round_id=self.round_id,
            client_address=self.client_address,
            sample_input=self.sample_in,
            sample_output=self.sample_out,
        )
        fake_update_hash = "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"

        is_valid, msg = self.prover.verify_proof(
            proof_hex=result["proof_hex"],
            public_inputs=result["public_inputs_decimal"],
            expected_model_hash=self.base_hash,
            expected_update_hash=fake_update_hash,
            expected_round_id=self.round_id,
        )
        self.assertFalse(is_valid)
        self.assertIn("Update hash mismatch", msg)

    def test_wrong_round_id_rejection(self):
        """Replay attack with wrong round ID must fail verification."""
        result = self.prover.generate_proof(
            base_model_hash=self.base_hash,
            update_hash=self.update_hash,
            round_id=self.round_id,
            client_address=self.client_address,
            sample_input=self.sample_in,
            sample_output=self.sample_out,
        )

        is_valid, msg = self.prover.verify_proof(
            proof_hex=result["proof_hex"],
            public_inputs=result["public_inputs_decimal"],
            expected_model_hash=self.base_hash,
            expected_update_hash=self.update_hash,
            expected_round_id=99,  # Wrong round
        )
        self.assertFalse(is_valid)
        self.assertIn("Round ID mismatch", msg)

    def test_corrupted_proof_payload_rejection(self):
        """Corrupted proof hex must fail verification."""
        result = self.prover.generate_proof(
            base_model_hash=self.base_hash,
            update_hash=self.update_hash,
            round_id=self.round_id,
            client_address=self.client_address,
            sample_input=self.sample_in,
            sample_output=self.sample_out,
        )
        # Corrupt proof payload
        corrupted_hex = result["proof_hex"][:-8] + "ffffffff"

        is_valid, msg = self.prover.verify_proof(
            proof_hex=corrupted_hex,
            public_inputs=result["public_inputs_decimal"],
            expected_model_hash=self.base_hash,
            expected_update_hash=self.update_hash,
            expected_round_id=self.round_id,
        )
        self.assertFalse(is_valid)


if __name__ == "__main__":
    unittest.main()
