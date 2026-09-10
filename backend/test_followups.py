"""
test_followups.py
=================
Backend test suite for the Follow-ups API (POST, GET, PATCH, DELETE).

Test cases:
  1. ASHA creates a follow-up for a valid patient.
  2. ASHA can retrieve the follow-up they created.
  3. ASHA can list all their own follow-ups (including filtering by patient).
  4. A second ASHA cannot see the first ASHA's follow-ups.
  5. DHO/HOSPITAL user cannot be confused with ASHA's follow-up list (isolation).
  6. ASHA can update (patch) the follow-up status to COMPLETED.
  7. ASHA can mark visited=True via PATCH.
  8. Creating a follow-up for a non-existent patient returns 404.
  9. Getting a non-existent follow-up by ID returns 404.
 10. Unauthenticated requests return 401.
"""

import unittest
from datetime import date, timedelta
from uuid import uuid4

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# ─── Credentials ─────────────────────────────────────────────────────────────
ASHA1_CREDS = {"username": "ASHA_NAND_023", "password": "asha2024"}
HOSPITAL_CREDS = {"username": "HOSPITAL_NAND_001", "password": "hospital2024"}
TOMORROW = (date.today() + timedelta(days=1)).isoformat()


def _login(creds: dict) -> dict:
    """Return auth headers for the given credentials."""
    r = client.post("/api/v1/auth/login", json=creds)
    assert r.status_code == 200, f"Login failed for {creds['username']}: {r.text}"
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def _create_patient(headers: dict) -> str:
    """Create a test patient and return its ID."""
    res = client.post("/api/v1/patients/", json={
        "name": f"Followup Test Patient {uuid4().hex[:6]}",
        "age": 32,
        "gender": "Female",
        "phone": "9988776655",
        "village": "Chinchpada",
    }, headers=headers)
    assert res.status_code == 201, f"Patient creation failed: {res.text}"
    return res.json()["id"]


# ─── Test suite ──────────────────────────────────────────────────────────────

class TestFollowupsAPI(unittest.TestCase):

    def setUp(self):
        """Authenticate as ASHA1 and create a test patient once per test."""
        self.asha1_headers = _login(ASHA1_CREDS)
        self.hospital_headers = _login(HOSPITAL_CREDS)
        self.patient_id = _create_patient(self.asha1_headers)

    # ── Test 1: ASHA creates a follow-up ────────────────────────────────────

    def test_01_asha_creates_followup(self):
        """POST /api/v1/followups/ creates a follow-up and returns 201."""
        res = client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "ANC Care",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
            "notes": "Check iron supplementation progress",
        }, headers=self.asha1_headers)

        self.assertEqual(res.status_code, 201, res.text)
        data = res.json()
        self.assertEqual(data["patient_id"], self.patient_id)
        self.assertEqual(data["category"], "ANC Care")
        self.assertEqual(data["urgency"], "ROUTINE")
        self.assertEqual(data["followup_date"], TOMORROW)
        self.assertEqual(data["status"], "PENDING")
        self.assertFalse(data["visited"])
        self.assertEqual(data["notes"], "Check iron supplementation progress")
        self.assertIn("id", data)
        self.assertIn("assigned_asha_id", data)

    # ── Test 2: ASHA retrieves their own follow-up by ID ────────────────────

    def test_02_asha_gets_followup_by_id(self):
        """GET /api/v1/followups/{id} returns the correct follow-up."""
        create_res = client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "TB DOTS",
            "urgency": "URGENT",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201, create_res.text)
        fid = create_res.json()["id"]

        get_res = client.get(f"/api/v1/followups/{fid}", headers=self.asha1_headers)
        self.assertEqual(get_res.status_code, 200, get_res.text)
        self.assertEqual(get_res.json()["id"], fid)
        self.assertEqual(get_res.json()["category"], "TB DOTS")

    # ── Test 3: ASHA lists their follow-ups ─────────────────────────────────

    def test_03_asha_lists_followups(self):
        """GET /api/v1/followups/ returns only ASHA's own follow-ups."""
        # Create two follow-ups for ASHA1
        for cat in ("ANC Care", "Immunization"):
            r = client.post("/api/v1/followups/", json={
                "patient_id": self.patient_id,
                "category": cat,
                "urgency": "ROUTINE",
                "followup_date": TOMORROW,
            }, headers=self.asha1_headers)
            self.assertEqual(r.status_code, 201, r.text)

        list_res = client.get("/api/v1/followups/", headers=self.asha1_headers)
        self.assertEqual(list_res.status_code, 200, list_res.text)
        items = list_res.json()
        self.assertIsInstance(items, list)
        self.assertGreaterEqual(len(items), 2)

    # ── Test 3b: Filter list by patient_id ──────────────────────────────────

    def test_03b_list_followups_filtered_by_patient(self):
        """GET /api/v1/followups/?patient_id=... filters correctly."""
        # Create a follow-up for this patient
        client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "ANC Care",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)

        list_res = client.get(
            f"/api/v1/followups/?patient_id={self.patient_id}",
            headers=self.asha1_headers,
        )
        self.assertEqual(list_res.status_code, 200, list_res.text)
        items = list_res.json()
        self.assertTrue(all(item["patient_id"] == self.patient_id for item in items))

    # ── Test 4: Second ASHA cannot see first ASHA's follow-ups ──────────────

    def test_04_second_asha_cannot_see_first_asha_followups(self):
        """A second ASHA user gets an empty list (doesn't see ASHA1's records)."""
        # Register a second ASHA for this test
        asha2_username = f"asha_test_{uuid4().hex[:8]}"
        reg_res = client.post("/api/v1/auth/register", json={
            "username": asha2_username,
            "password": "testpass123",
            "fullName": "Test ASHA 2",
        })
        self.assertIn(reg_res.status_code, (200, 201), f"Registration failed: {reg_res.text}")

        asha2_headers = _login({"username": asha2_username, "password": "testpass123"})

        # Create a follow-up under ASHA1
        client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "ANC Care",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)

        # ASHA2 lists their own follow-ups — should NOT include ASHA1's records
        list_res = client.get("/api/v1/followups/", headers=asha2_headers)
        self.assertEqual(list_res.status_code, 200, list_res.text)
        items = list_res.json()
        asha1_ids = {self.patient_id}
        for item in items:
            self.assertNotIn(item["patient_id"], asha1_ids,
                             "ASHA2 should not see ASHA1's patient follow-ups")

    # ── Test 5: PATCH updates status to COMPLETED ───────────────────────────

    def test_05_patch_followup_status_completed(self):
        """PATCH /api/v1/followups/{id} can mark follow-up as COMPLETED."""
        create_res = client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "TB DOTS",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201, create_res.text)
        fid = create_res.json()["id"]

        patch_res = client.patch(f"/api/v1/followups/{fid}", json={
            "status": "COMPLETED",
            "visited": True,
            "notes": "Patient visited. Iron levels improving.",
        }, headers=self.asha1_headers)
        self.assertEqual(patch_res.status_code, 200, patch_res.text)
        data = patch_res.json()
        self.assertEqual(data["status"], "COMPLETED")
        self.assertTrue(data["visited"])
        self.assertEqual(data["notes"], "Patient visited. Iron levels improving.")

    # ── Test 6: PATCH updates status to CANCELLED ───────────────────────────

    def test_06_patch_followup_status_cancelled(self):
        """PATCH /api/v1/followups/{id} can cancel a follow-up."""
        create_res = client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "Immunization",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201, create_res.text)
        fid = create_res.json()["id"]

        patch_res = client.patch(f"/api/v1/followups/{fid}", json={
            "status": "CANCELLED",
        }, headers=self.asha1_headers)
        self.assertEqual(patch_res.status_code, 200, patch_res.text)
        self.assertEqual(patch_res.json()["status"], "CANCELLED")

    # ── Test 7: Non-existent patient returns 404 ────────────────────────────

    def test_07_create_followup_invalid_patient_returns_404(self):
        """POST /api/v1/followups/ with non-existent patient_id returns 404."""
        fake_patient_id = str(uuid4())
        res = client.post("/api/v1/followups/", json={
            "patient_id": fake_patient_id,
            "category": "General",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)
        self.assertEqual(res.status_code, 404, res.text)

    # ── Test 8: Non-existent follow-up ID returns 404 ───────────────────────

    def test_08_get_nonexistent_followup_returns_404(self):
        """GET /api/v1/followups/{id} with unknown UUID returns 404."""
        fake_fid = str(uuid4())
        res = client.get(f"/api/v1/followups/{fake_fid}", headers=self.asha1_headers)
        self.assertEqual(res.status_code, 404, res.text)

    # ── Test 9: Unauthenticated requests return 401 ─────────────────────────

    def test_09_unauthenticated_create_returns_401(self):
        """POST /api/v1/followups/ without token returns 401/403."""
        res = client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "ANC Care",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
        })
        self.assertIn(res.status_code, (401, 403), res.text)

    def test_09b_unauthenticated_list_returns_401(self):
        """GET /api/v1/followups/ without token returns 401/403."""
        res = client.get("/api/v1/followups/")
        self.assertIn(res.status_code, (401, 403), res.text)

    # ── Test 10: upcoming_only filter ───────────────────────────────────────

    def test_10_upcoming_only_filter(self):
        """GET /api/v1/followups/?upcoming_only=true only returns future dates."""
        # Create a follow-up with tomorrow's date
        client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "ANC Care",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)

        res = client.get("/api/v1/followups/?upcoming_only=true", headers=self.asha1_headers)
        self.assertEqual(res.status_code, 200, res.text)
        items = res.json()
        today = date.today().isoformat()
        for item in items:
            self.assertGreaterEqual(item["followup_date"], today,
                                    f"Follow-up date {item['followup_date']} is in the past")

    # ── Test 11: Status filter ───────────────────────────────────────────────

    def test_11_status_filter_pending(self):
        """GET /api/v1/followups/?status=PENDING only returns PENDING follow-ups."""
        # Create a PENDING follow-up
        client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "Nutrition",
            "urgency": "ROUTINE",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)

        res = client.get("/api/v1/followups/?status=PENDING", headers=self.asha1_headers)
        self.assertEqual(res.status_code, 200, res.text)
        items = res.json()
        for item in items:
            self.assertEqual(item["status"], "PENDING",
                             f"Expected PENDING, got {item['status']}")

    # ── Test 12: Follow-up with minimal required fields ──────────────────────

    def test_12_create_followup_minimal_fields(self):
        """POST /api/v1/followups/ with only required fields succeeds."""
        res = client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "General",
            "followup_date": TOMORROW,
        }, headers=self.asha1_headers)
        self.assertEqual(res.status_code, 201, res.text)
        data = res.json()
        self.assertEqual(data["urgency"], "ROUTINE")   # default
        self.assertEqual(data["status"], "PENDING")    # default
        self.assertFalse(data["visited"])              # default
        self.assertIsNone(data["notes"])               # optional → None


    # ── Test 13: DHO/HOSPITAL role can see all follow-ups ───────────────────

    def test_13_hospital_role_sees_all_followups(self):
        """GET /api/v1/followups/ for HOSPITAL role returns all follow-ups, not just their own."""
        # ASHA creates a follow-up for their patient
        create_res = client.post("/api/v1/followups/", json={
            "patient_id": self.patient_id,
            "category": "ANC Care",
            "urgency": "URGENT",
            "followup_date": TOMORROW,
            "notes": "ASHA1 created this",
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201, create_res.text)
        created_id = create_res.json()["id"]
        created_asha_id = create_res.json()["assigned_asha_id"]

        # HOSPITAL user lists all follow-ups — should include the ASHA's record
        list_res = client.get("/api/v1/followups/", headers=self.hospital_headers)
        self.assertEqual(list_res.status_code, 200, list_res.text)
        items = list_res.json()

        found_ids = [item["id"] for item in items]
        self.assertIn(
            created_id,
            found_ids,
            f"HOSPITAL role should see ASHA's follow-up {created_id} but only got: {found_ids}",
        )

        # Also verify the follow-up belongs to ASHA (assigned_asha_id != hospital user's id)
        matched = next(i for i in items if i["id"] == created_id)
        self.assertEqual(matched["assigned_asha_id"], created_asha_id)


if __name__ == "__main__":
    unittest.main(verbosity=2)
