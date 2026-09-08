import unittest
from uuid import uuid4
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestPhase4TriageAndSync(unittest.TestCase):
    def setUp(self):
        # Authenticate and get token
        r = client.post("/api/v1/auth/login", json={"username": "ASHA_NAND_023", "password": "asha2024"})
        self.assertEqual(r.status_code, 200)
        self.token = r.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

        # Create a test patient for triage tests
        p_res = client.post("/api/v1/patients/", json={
            "name": "Test Patient",
            "age": 30,
            "gender": "Female",
            "phone": "9998887770",
            "village": "Chinchpada"
        }, headers=self.headers)
        self.assertEqual(p_res.status_code, 201)
        self.patient_id = p_res.json()["id"]

    def test_1_emergency_dyspnea_and_pregnancy(self):
        res = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["breathing", "pregnancy"]
        }, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["triage_category"], "EMERGENCY")
        self.assertIn("Dyspnea", data["reason"])
        self.assertIn("Pregnancy", data["reason"])

    def test_2_emergency_total_score_ge_5(self):
        res = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["breathing", "fever", "headache", "weakness"]  # 3 + 1 + 1 + 1 = 6
        }, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["triage_category"], "EMERGENCY")
        self.assertGreaterEqual(data["triage_score"], 5)

    def test_3_urgent_total_score_ge_2(self):
        res = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["fever", "headache"]  # 1 + 1 = 2
        }, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["triage_category"], "URGENT")
        self.assertEqual(data["triage_score"], 2)

    def test_4_urgent_child_under_5(self):
        res = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["child"]  # child under 5
        }, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["triage_category"], "URGENT")
        self.assertIn("under 5", data["reason"].lower())

    def test_5_routine_score_lt_2(self):
        res = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["fever"]  # score = 1
        }, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["triage_category"], "ROUTINE")
        self.assertEqual(data["triage_score"], 1)

    def test_6_missing_invalid_patient_returns_404(self):
        fake_uuid = str(uuid4())
        res = client.post("/api/v1/triage/assess", json={
            "patient_id": fake_uuid,
            "symptoms": ["fever"]
        }, headers=self.headers)
        self.assertEqual(res.status_code, 404)

    def test_7_unauthorized_request_returns_401(self):
        res = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["fever"]
        })
        self.assertEqual(res.status_code, 401)

    def test_8_triage_record_is_saved(self):
        res = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["vomiting", "chronic"]  # 1 + 1 = 2
        }, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertIsNotNone(data["id"])
        self.assertEqual(data["patient_id"], self.patient_id)

    def test_9_offline_sync_creates_record(self):
        offline_p_id = str(uuid4())
        offline_t_id = str(uuid4())

        batch = {
            "patients": [
                {
                    "id": offline_p_id,
                    "name": "Offline Synced Patient",
                    "age": 40,
                    "gender": "Male",
                    "phone": "9112233445",
                    "village": "Chinchpada"
                }
            ],
            "triage_records": [
                {
                    "id": offline_t_id,
                    "patient_id": offline_p_id,
                    "symptoms": ["breathing", "pregnancy"]
                }
            ]
        }

        res = client.post("/api/v1/sync", json=batch, headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["synced_count"], 2)
        self.assertEqual(data["failed_count"], 0)

        # Check patient status
        p_status = next(r for r in data["results"] if r["id"] == offline_p_id)
        self.assertEqual(p_status["status"], "created")

        # Check triage status
        t_status = next(r for r in data["results"] if r["id"] == offline_t_id)
        self.assertEqual(t_status["status"], "created")

        # Test 10: Repeating same sync does NOT create duplicate (idempotency)
        repeat_res = client.post("/api/v1/sync", json=batch, headers=self.headers)
        self.assertEqual(repeat_res.status_code, 200)
        repeat_data = repeat_res.json()
        self.assertEqual(repeat_data["synced_count"], 2)

        repeat_p_status = next(r for r in repeat_data["results"] if r["id"] == offline_p_id)
        self.assertEqual(repeat_p_status["status"], "already_existed")

        repeat_t_status = next(r for r in repeat_data["results"] if r["id"] == offline_t_id)
        self.assertEqual(repeat_t_status["status"], "already_existed")


if __name__ == "__main__":
    unittest.main()
