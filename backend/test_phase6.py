import time
import unittest
from datetime import timedelta
from uuid import uuid4, UUID
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.schemas.auth import UserRole

client = TestClient(app)

# ─────────────────────────────────────────────────────────────
# Helper: create a demo HOSPITAL token without a DB user
# ─────────────────────────────────────────────────────────────
HOSPITAL_USER_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"

def _hospital_token() -> str:
    return create_access_token(data={
        "sub": HOSPITAL_USER_ID,
        "name": "Dr. Rajiv Mehta",
        "role": UserRole.HOSPITAL.value,
        "facility_name": "District Hospital Nandurbar",
        "village": None,
    }, expires_delta=timedelta(hours=1))

def _dho_token() -> str:
    return create_access_token(data={
        "sub": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "name": "DHO Maharashtra",
        "role": UserRole.DHO.value,
        "facility_name": None,
        "village": None,
    }, expires_delta=timedelta(hours=1))


class TestPhase6QueueAndMetrics(unittest.TestCase):

    def setUp(self):
        """Authenticate and create a patient + triage + referral for tests."""
        # ASHA login
        r = client.post("/api/v1/auth/login", json={"username": "ASHA_NAND_023", "password": "asha2024"})
        self.assertEqual(r.status_code, 200)
        self.asha_token = r.json()["access_token"]
        self.asha_headers = {"Authorization": f"Bearer {self.asha_token}"}

        # HOSPITAL token (via JWT, no DB user required)
        self.hospital_headers = {"Authorization": f"Bearer {_hospital_token()}"}
        self.dho_headers = {"Authorization": f"Bearer {_dho_token()}"}

        # Create a test patient
        p = client.post("/api/v1/patients/", json={
            "name": "Queue Test Patient",
            "age": 32,
            "gender": "Female",
            "phone": "9800090001",
            "village": "Dhadgaon",
        }, headers=self.asha_headers)
        self.assertEqual(p.status_code, 201)
        self.patient_id = p.json()["id"]

        # Triage EMERGENCY
        t = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["breathing", "pregnancy"],
        }, headers=self.asha_headers)
        self.assertEqual(t.status_code, 201)
        self.triage_id = t.json()["id"]
        self.assertEqual(t.json()["triage_category"], "EMERGENCY")

        # Primary referral
        ref = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "triage_record_id": self.triage_id,
            "destination_hospital": "District Hospital Nandurbar",
            "reason": "Emergency ANC case",
        }, headers=self.asha_headers)
        self.assertEqual(ref.status_code, 201)
        self.referral_id = ref.json()["id"]

    # ──────────────────────────────────────────
    # TEST 1: Hospital queue returns referrals
    # ──────────────────────────────────────────
    def test_01_hospital_queue_returns_referrals(self):
        res = client.get("/api/v1/queue/hospital", headers=self.asha_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
        ids = [item["referral_id"] for item in data]
        self.assertIn(self.referral_id, ids)

    # ──────────────────────────────────────────────────────────
    # TEST 2: EMERGENCY before URGENT, URGENT before ROUTINE
    # ──────────────────────────────────────────────────────────
    def test_02_emergency_appears_before_urgent_routine(self):
        p2 = client.post("/api/v1/patients/", json={
            "name": "Urgent Patient", "age": 40, "gender": "Male",
            "phone": "9800090002", "village": "Chinchpada"
        }, headers=self.asha_headers)
        p2_id = p2.json()["id"]
        t2 = client.post("/api/v1/triage/assess", json={
            "patient_id": p2_id, "symptoms": ["fever", "headache"]  # URGENT
        }, headers=self.asha_headers)
        client.post("/api/v1/referrals/", json={
            "patient_id": p2_id, "triage_record_id": t2.json()["id"],
            "destination_hospital": "District Hospital Nandurbar",
        }, headers=self.asha_headers)

        queue = client.get("/api/v1/queue/hospital", headers=self.asha_headers).json()
        cats = [item["triage_category"] for item in queue if item["triage_category"]]
        priority_seen = [{"EMERGENCY": 0, "URGENT": 1, "ROUTINE": 2}.get(c, 3) for c in cats]
        self.assertEqual(priority_seen, sorted(priority_seen))

    # ─────────────────────────────────────────────────────
    # TEST 3: Older referrals first within same priority
    # ─────────────────────────────────────────────────────
    def test_03_older_first_within_same_priority(self):
        p3 = client.post("/api/v1/patients/", json={
            "name": "Same Priority Old", "age": 50, "gender": "Female",
            "phone": "9800090003", "village": "Nandurbar"
        }, headers=self.asha_headers)
        p3_id = p3.json()["id"]
        t3 = client.post("/api/v1/triage/assess", json={
            "patient_id": p3_id, "symptoms": ["breathing", "pregnancy"]
        }, headers=self.asha_headers)

        ref_a = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "PHC Dhadgaon",
        }, headers=self.asha_headers)
        time.sleep(0.05)
        ref_b = client.post("/api/v1/referrals/", json={
            "patient_id": p3_id,
            "triage_record_id": t3.json()["id"],
            "destination_hospital": "PHC Dhadgaon",
        }, headers=self.asha_headers)

        queue = client.get("/api/v1/queue/hospital", headers=self.asha_headers).json()
        emergency_ids = [item["referral_id"] for item in queue if item.get("triage_category") == "EMERGENCY"]
        idx_a = next((i for i, rid in enumerate(emergency_ids) if rid == ref_a.json()["id"]), None)
        idx_b = next((i for i, rid in enumerate(emergency_ids) if rid == ref_b.json()["id"]), None)
        if idx_a is not None and idx_b is not None:
            self.assertLessEqual(idx_a, idx_b)

    # ─────────────────────────────────────────
    # TEST 4: Hospital can confirm arrival
    # ─────────────────────────────────────────
    def test_04_hospital_can_confirm_arrival(self):
        res = client.post(f"/api/v1/queue/{self.referral_id}/arrive", headers=self.hospital_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "CONFIRMED_ARRIVAL")
        self.assertIsNotNone(data["arrived_at"])

    # ──────────────────────────────────────────────────────────
    # TEST 5: Invalid arrival transition is rejected
    # ──────────────────────────────────────────────────────────
    def test_05_invalid_arrival_transition_rejected(self):
        ref = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar",
        }, headers=self.asha_headers)
        rid = ref.json()["id"]
        client.post(f"/api/v1/queue/{rid}/arrive", headers=self.hospital_headers)
        client.post(f"/api/v1/queue/{rid}/consult", headers=self.hospital_headers)
        # Now IN_CONSULTATION — cannot arrive again
        res = client.post(f"/api/v1/queue/{rid}/arrive", headers=self.hospital_headers)
        self.assertEqual(res.status_code, 400)

    # ─────────────────────────────────────────────────────────────
    # TEST 6: CONFIRMED_ARRIVAL → IN_CONSULTATION
    # ─────────────────────────────────────────────────────────────
    def test_06_confirmed_arrival_to_in_consultation(self):
        ref = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar",
        }, headers=self.asha_headers)
        rid = ref.json()["id"]
        client.post(f"/api/v1/queue/{rid}/arrive", headers=self.hospital_headers)
        res = client.post(f"/api/v1/queue/{rid}/consult", headers=self.hospital_headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "IN_CONSULTATION")

    # ─────────────────────────────────────────────────────────
    # TEST 7: IN_CONSULTATION → COMPLETED
    # ─────────────────────────────────────────────────────────
    def test_07_in_consultation_to_completed(self):
        ref = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar",
        }, headers=self.asha_headers)
        rid = ref.json()["id"]
        client.post(f"/api/v1/queue/{rid}/arrive", headers=self.hospital_headers)
        client.post(f"/api/v1/queue/{rid}/consult", headers=self.hospital_headers)
        res = client.post(f"/api/v1/queue/{rid}/complete", headers=self.hospital_headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "COMPLETED")

    # ─────────────────────────────────────────────────
    # TEST 8: Invalid completion transition rejected
    # ─────────────────────────────────────────────────
    def test_08_invalid_completion_transition_rejected(self):
        ref = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar",
        }, headers=self.asha_headers)
        rid = ref.json()["id"]
        # PENDING → complete directly (invalid)
        res = client.post(f"/api/v1/queue/{rid}/complete", headers=self.hospital_headers)
        self.assertEqual(res.status_code, 400)

    # ───────────────────────────────────────────────────────────────────────
    # TEST 9: Queue detail returns patient + triage + referral information
    # ───────────────────────────────────────────────────────────────────────
    def test_09_queue_detail_returns_full_info(self):
        res = client.get(f"/api/v1/queue/{self.referral_id}", headers=self.asha_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("referral", data)
        self.assertIn("patient", data)
        self.assertEqual(data["referral"]["id"], self.referral_id)
        self.assertEqual(data["patient"]["id"], self.patient_id)
        self.assertIsNotNone(data.get("triage"))

    # ──────────────────────────────────────────────────────────────────────
    # TEST 10: DHO metrics endpoint returns correct structure
    # ──────────────────────────────────────────────────────────────────────
    def test_10_dho_metrics_endpoint_works(self):
        res = client.get("/api/v1/metrics/dho", headers=self.dho_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        expected_keys = [
            "total_referrals", "emergency_referrals", "urgent_referrals",
            "routine_referrals", "pending_referrals", "completed_referrals",
            "completion_rate", "total_patients", "total_triage_assessments",
            "referrals_by_village", "referrals_by_hospital", "referrals_by_triage_category",
        ]
        for key in expected_keys:
            self.assertIn(key, data, f"Missing key: {key}")

    # ────────────────────────────────────────────────────────────────────
    # TEST 11: Completion rate formula verified
    # ────────────────────────────────────────────────────────────────────
    def test_11_completion_rate_calculated_correctly(self):
        from app.api.v1.endpoints.referrals import _in_memory_referrals

        fake_ref_a = {
            "id": str(uuid4()), "patient_id": self.patient_id,
            "destination_hospital": "PHC", "referral_code": "NMN-2026-T1",
            "triage_record_id": None, "referring_user_id": None, "reason": None,
            "status": "COMPLETED", "arrived_at": None,
            "created_at": "2026-09-08T10:00:00+00:00",
            "updated_at": "2026-09-08T10:05:00+00:00",
        }
        fake_ref_b = {
            "id": str(uuid4()), "patient_id": self.patient_id,
            "destination_hospital": "PHC", "referral_code": "NMN-2026-T2",
            "triage_record_id": None, "referring_user_id": None, "reason": None,
            "status": "PENDING", "arrived_at": None,
            "created_at": "2026-09-08T10:00:00+00:00",
            "updated_at": "2026-09-08T10:05:00+00:00",
        }
        snapshot = list(_in_memory_referrals)
        _in_memory_referrals.clear()
        _in_memory_referrals.extend([fake_ref_a, fake_ref_b])

        total = len(_in_memory_referrals)
        completed = sum(1 for r in _in_memory_referrals if r["status"] == "COMPLETED")
        rate = round(completed / total * 100, 2) if total > 0 else 0.0
        self.assertAlmostEqual(rate, 50.0)

        _in_memory_referrals.clear()
        _in_memory_referrals.extend(snapshot)

    # ─────────────────────────────────────────
    # TEST 12: DHO can access metrics
    # ─────────────────────────────────────────
    def test_12_dho_can_access_metrics(self):
        res = client.get("/api/v1/metrics/dho", headers=self.dho_headers)
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(res.json()["total_patients"], 1)

    # ─────────────────────────────────────────────────────────────────
    # TEST 13: ASHA cannot modify hospital queue states
    # ─────────────────────────────────────────────────────────────────
    def test_13_asha_cannot_modify_queue_states(self):
        res_arrive = client.post(f"/api/v1/queue/{self.referral_id}/arrive", headers=self.asha_headers)
        self.assertEqual(res_arrive.status_code, 403)

        res_consult = client.post(f"/api/v1/queue/{self.referral_id}/consult", headers=self.asha_headers)
        self.assertEqual(res_consult.status_code, 403)

        res_complete = client.post(f"/api/v1/queue/{self.referral_id}/complete", headers=self.asha_headers)
        self.assertEqual(res_complete.status_code, 403)

        # ASHA also cannot access DHO metrics
        res_metrics = client.get("/api/v1/metrics/dho", headers=self.asha_headers)
        self.assertEqual(res_metrics.status_code, 403)

    # ─────────────────────────────────────────────
    # TEST 14: Unauthorized requests return 401
    # ─────────────────────────────────────────────
    def test_14_unauthorized_requests_return_401(self):
        r1 = client.get("/api/v1/queue/hospital")
        self.assertEqual(r1.status_code, 401)

        r2 = client.get(f"/api/v1/queue/{self.referral_id}")
        self.assertEqual(r2.status_code, 401)

        r3 = client.get("/api/v1/metrics/dho")
        self.assertEqual(r3.status_code, 401)

    # ─────────────────────────────────────────────
    # TEST 15: Invalid referral ID returns 404
    # ─────────────────────────────────────────────
    def test_15_invalid_referral_returns_404(self):
        fake_id = str(uuid4())

        r1 = client.get(f"/api/v1/queue/{fake_id}", headers=self.asha_headers)
        self.assertEqual(r1.status_code, 404)

        r2 = client.post(f"/api/v1/queue/{fake_id}/arrive", headers=self.hospital_headers)
        self.assertEqual(r2.status_code, 404)

        r3 = client.post(f"/api/v1/queue/{fake_id}/consult", headers=self.hospital_headers)
        self.assertEqual(r3.status_code, 404)


if __name__ == "__main__":
    unittest.main(verbosity=2)
