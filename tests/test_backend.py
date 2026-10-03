"""
Integration tests for FastAPI Backend API Server and Master Orchestrator.
Validates:
1. Network stats endpoint
2. Models catalog endpoint
3. Live end-to-end round execution (/api/demo/run-round)
4. AI Passport profile retrieval
5. Compute providers listing
"""

import unittest
from fastapi.testclient import TestClient
from backend.api.main import app


class TestBackendAPI(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        # Execute an initial round to populate contributions and proofs
        cls.client.post("/api/demo/run-round", json={"epochs": 1, "learning_rate": 0.03})

    def test_network_stats(self):
        """Stats endpoint must return accurate chain statuses and metrics."""
        response = self.client.get("/api/network/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("active_contributors", data)
        self.assertIn("chains_status", data)
        self.assertEqual(data["chains_status"]["arbitrum"]["status"], "OPERATIONAL")
        self.assertEqual(data["chains_status"]["solana"]["status"], "OPERATIONAL")

    def test_models_list(self):
        """Models catalog must contain bootstrapped DiagnosticNet."""
        response = self.client.get("/api/models")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data), 0)
        self.assertEqual(data[0]["id"], "Pneumonia-Diagnostic-v1")

    def test_live_round_execution(self):
        """Executing a live round must process all nodes, proofs, and rewards."""
        response = self.client.post("/api/demo/run-round", json={"epochs": 2, "learning_rate": 0.03})
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertIn("round_id", res)
        self.assertEqual(res["proofs_verified"], 3)
        self.assertEqual(res["raw_data_uploaded"], 0)
        self.assertEqual(len(res["solana_payouts"]), 3)

    def test_contributions_and_proofs(self):
        """Contributions and proofs must be recorded after round."""
        c_resp = self.client.get("/api/contributions")
        self.assertEqual(c_resp.status_code, 200)
        self.assertGreater(len(c_resp.json()), 0)

        p_resp = self.client.get("/api/proofs")
        self.assertEqual(p_resp.status_code, 200)
        self.assertGreater(len(p_resp.json()), 0)

    def test_passport(self):
        """AI Passport profile must reflect verified reputation."""
        response = self.client.get("/api/passport/0x71C66336071ffd4e773E34dac3Ca0A6688211eef")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(data["verified_contributions"], 0)
        self.assertIn("tier", data)

    def test_providers(self):
        """Compute providers list must return registered nodes."""
        response = self.client.get("/api/providers")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(len(data), 3)


if __name__ == "__main__":
    unittest.main()
