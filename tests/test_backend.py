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
        self.assertGreaterEqual(res["proofs_verified"], 3)
        self.assertEqual(res["raw_data_uploaded"], 0)
        self.assertGreaterEqual(len(res["solana_payouts"]), 3)

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

    def test_websocket_training_stream(self):
        """WebSocket endpoint /ws/training must accept connection and respond to PING."""
        import json
        with self.client.websocket_connect("/ws/training") as ws:
            conn_frame = ws.receive_json()
            self.assertEqual(conn_frame["event"], "WS_CONNECTED")
            self.assertEqual(conn_frame["data"]["status"], "ONLINE")
            ws.send_text(json.dumps({"action": "PING"}))
            pong_frame = ws.receive_json()
            self.assertEqual(pong_frame["event"], "PONG")

    def test_dataset_upload_stream(self):
        """Streaming multipart dataset upload must parse headers and store file."""
        csv_content = b"feature1,feature2,feature3,label\n1.0,2.0,3.0,1\n4.0,5.0,6.0,0\n7.0,8.0,9.0,1\n"
        response = self.client.post(
            "/api/datasets/upload",
            files={"file": ("test_hospital_data.csv", csv_content, "text/csv")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["filename"], "test_hospital_data.csv")
        self.assertEqual(data["total_rows"], 3)
        self.assertIn("feature1", data["headers"])
        self.assertIn("label", data["headers"])

    def test_pipeline_management(self):
        """Pipeline endpoints must return templates, active code, and accept custom scripts."""
        # 1. Templates
        t_resp = self.client.get("/api/pipeline/templates")
        self.assertEqual(t_resp.status_code, 200)
        templates = t_resp.json()
        self.assertGreaterEqual(len(templates), 3)

        # 2. Current pipeline
        c_resp = self.client.get("/api/pipeline/current")
        self.assertEqual(c_resp.status_code, 200)
        self.assertIn("code", c_resp.json())

        # 3. Deploy custom pipeline
        custom_code = "# Custom Edge Model\ndef load_local_dataset(p):\n    return [[1,2]], [0]\ndef train_step(m, X, y, e, lr):\n    return m, [{'epoch': 1, 'loss': 0.1}]\n"
        d_resp = self.client.post("/api/pipeline/deploy", json={
            "code": custom_code,
            "template_key": "custom",
            "model_name": "EdgeCustomNet"
        })
        self.assertEqual(d_resp.status_code, 200)
        self.assertTrue(d_resp.json()["success"])

        # 4. Download pipeline
        dl_resp = self.client.get("/api/pipeline/download")
        self.assertEqual(dl_resp.status_code, 200)
        self.assertIn("Custom Edge Model", dl_resp.text)


if __name__ == "__main__":
    unittest.main()

