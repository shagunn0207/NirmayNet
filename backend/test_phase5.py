import unittest
from uuid import uuid4
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestPhase5ReferralsDispatchTeleconsult(unittest.TestCase):
    def setUp(self):
        # Authenticate ASHA user
        r_auth = client.post("/api/v1/auth/login", json={"username": "ASHA_NAND_023", "password": "asha2024"})
        self.assertEqual(r_auth.status_code, 200)
        self.token = r_auth.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

        # Register a test patient
        p_res = client.post("/api/v1/patients/", json={
            "name": "Sunita Patil",
            "age": 29,
            "gender": "Female",
            "phone": "9823000111",
            "village": "Chinchpada"
        }, headers=self.headers)
        self.assertEqual(p_res.status_code, 201)
        self.patient_id = p_res.json()["id"]

        # Assess triage for patient
        t_res = client.post("/api/v1/triage/assess", json={
            "patient_id": self.patient_id,
            "symptoms": ["breathing", "pregnancy"]
        }, headers=self.headers)
        self.assertEqual(t_res.status_code, 201)
        self.triage_id = t_res.json()["id"]

    def test_1_create_referral_successfully(self):
        res = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "triage_record_id": self.triage_id,
            "destination_hospital": "District Hospital Nandurbar",
            "reason": "High-risk pregnancy with severe dyspnea"
        }, headers=self.headers)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["patient_id"], self.patient_id)
        self.assertEqual(data["triage_record_id"], self.triage_id)
        self.assertEqual(data["status"], "PENDING")
        self.assertIsNotNone(data["referral_code"])

    def test_2_invalid_patient_returns_404(self):
        fake_p_id = str(uuid4())
        res = client.post("/api/v1/referrals/", json={
            "patient_id": fake_p_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)
        self.assertEqual(res.status_code, 404)

    def test_3_invalid_triage_record_returns_error(self):
        fake_t_id = str(uuid4())
        res = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "triage_record_id": fake_t_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)
        self.assertEqual(res.status_code, 404)

    def test_4_list_referrals(self):
        # Create a referral first
        client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)

        res = client.get("/api/v1/referrals/", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(len(res.json()), 1)

    def test_5_get_referral(self):
        ref_res = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)
        ref_id = ref_res.json()["id"]

        get_res = client.get(f"/api/v1/referrals/{ref_id}", headers=self.headers)
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.json()["id"], ref_id)

    def test_6_update_referral_status(self):
        ref_res = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)
        ref_id = ref_res.json()["id"]

        patch_res = client.patch(f"/api/v1/referrals/{ref_id}/status", json={
            "status": "CONFIRMED_ARRIVAL"
        }, headers=self.headers)
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["status"], "CONFIRMED_ARRIVAL")

    def test_7_invalid_referral_status_rejected(self):
        ref_res = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)
        ref_id = ref_res.json()["id"]

        # Cancel referral
        client.patch(f"/api/v1/referrals/{ref_id}/status", json={
            "status": "CANCELLED"
        }, headers=self.headers)

        # Attempt invalid transition from CANCELLED to COMPLETED
        bad_patch = client.patch(f"/api/v1/referrals/{ref_id}/status", json={
            "status": "COMPLETED"
        }, headers=self.headers)
        self.assertEqual(bad_patch.status_code, 400)

    def test_8_and_9_create_108_dispatch_and_updates_referral_status(self):
        ref_res = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)
        ref_id = ref_res.json()["id"]
        self.assertEqual(ref_res.json()["status"], "PENDING")

        dispatch_res = client.post("/api/v1/dispatch/108", json={
            "referral_id": ref_id
        }, headers=self.headers)
        self.assertEqual(dispatch_res.status_code, 201)
        disp_data = dispatch_res.json()
        self.assertEqual(disp_data["referral_id"], ref_id)
        self.assertEqual(disp_data["vehicle_number"], "MH-39-A-1080")
        self.assertTrue(disp_data["simulation"])

        # Check that referral status updated to DISPATCHED
        ref_check = client.get(f"/api/v1/referrals/{ref_id}", headers=self.headers)
        self.assertEqual(ref_check.json()["status"], "DISPATCHED")

    def test_10_get_dispatch_information(self):
        ref_res = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)
        ref_id = ref_res.json()["id"]

        client.post("/api/v1/dispatch/108", json={"referral_id": ref_id}, headers=self.headers)

        get_disp = client.get(f"/api/v1/dispatch/{ref_id}", headers=self.headers)
        self.assertEqual(get_disp.status_code, 200)
        self.assertEqual(get_disp.json()["referral_id"], ref_id)

    def test_11_and_12_create_teleconsultation_room(self):
        ref_res = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "destination_hospital": "District Hospital Nandurbar"
        }, headers=self.headers)
        ref_id = ref_res.json()["id"]

        tele_res = client.post("/api/v1/teleconsult/room", json={
            "patient_id": self.patient_id,
            "referral_id": ref_id,
            "notes": "Urgent pre-arrival teleconsultation"
        }, headers=self.headers)
        self.assertEqual(tele_res.status_code, 201)
        data = tele_res.json()
        self.assertEqual(data["patient_id"], self.patient_id)
        self.assertIn("nirmaynet_teleconsult_", data["room_id"])
        self.assertIn("meet.jit.si", data["jitsi_url"])

        # Test GET teleconsultation
        tc_id = data["id"]
        get_tc = client.get(f"/api/v1/teleconsult/{tc_id}", headers=self.headers)
        self.assertEqual(get_tc.status_code, 200)
        self.assertEqual(get_tc.json()["id"], tc_id)

    def test_13_unauthorized_requests_return_401(self):
        r1 = client.post("/api/v1/referrals/", json={"patient_id": self.patient_id, "destination_hospital": "DH"})
        self.assertEqual(r1.status_code, 401)

        r2 = client.post("/api/v1/dispatch/108", json={"referral_id": str(uuid4())})
        self.assertEqual(r2.status_code, 401)

        r3 = client.post("/api/v1/teleconsult/room", json={"patient_id": self.patient_id})
        self.assertEqual(r3.status_code, 401)

    def test_14_full_referral_dispatch_teleconsult_workflow(self):
        # Step 1: Patient + Triage already created in setUp
        # Step 2: Create Referral
        r_ref = client.post("/api/v1/referrals/", json={
            "patient_id": self.patient_id,
            "triage_record_id": self.triage_id,
            "destination_hospital": "District Hospital Nandurbar",
            "reason": "Emergency high-risk case"
        }, headers=self.headers)
        self.assertEqual(r_ref.status_code, 201)
        ref_id = r_ref.json()["id"]

        # Step 3: Dispatch 108 Ambulance
        r_disp = client.post("/api/v1/dispatch/108", json={"referral_id": ref_id}, headers=self.headers)
        self.assertEqual(r_disp.status_code, 201)

        # Step 4: Create Teleconsultation Room
        r_tc = client.post("/api/v1/teleconsult/room", json={
            "patient_id": self.patient_id,
            "referral_id": ref_id
        }, headers=self.headers)
        self.assertEqual(r_tc.status_code, 201)

        # Step 5: Confirm Arrival at Hospital
        r_arr = client.patch(f"/api/v1/referrals/{ref_id}/status", json={
            "status": "CONFIRMED_ARRIVAL"
        }, headers=self.headers)
        self.assertEqual(r_arr.status_code, 200)
        self.assertEqual(r_arr.json()["status"], "CONFIRMED_ARRIVAL")


if __name__ == "__main__":
    unittest.main()
