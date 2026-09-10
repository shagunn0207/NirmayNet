"""
test_tasks.py
=============
Backend test suite for the Tasks / Reminders API (POST, GET, PATCH, DELETE).

Test cases:
  1. Authenticated ASHA creates a task.
  2. Authenticated ASHA lists their tasks.
  3. Authenticated ASHA updates task visited/status and title.
  4. Authenticated ASHA deletes a task.
  5. Second ASHA cannot list or access another ASHA's task (isolation).
  6. DHO/ADMIN can view and access all tasks.
  7. Unauthenticated requests return 401.
  8. 404 returned for non-existent task.
"""

import unittest
from datetime import timedelta
from uuid import uuid4

from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.schemas.auth import UserRole

client = TestClient(app)

# ─── User IDs & Helpers ───────────────────────────────────────────────────────
ASHA1_ID = "11111111-1111-1111-1111-111111111111"
ASHA2_ID = "22222222-2222-2222-2222-222222222222"
DHO_ID = "33333333-3333-3333-3333-333333333333"
ADMIN_ID = "44444444-4444-4444-4444-444444444444"


def _headers(user_id: str, role: str, name: str = "Test User") -> dict:
    """Generate JWT auth headers for testing."""
    token = create_access_token(data={
        "sub": user_id,
        "name": name,
        "role": role,
        "village": "Chinchpada",
        "facility_name": "Chinchpada Sub-Center",
    }, expires_delta=timedelta(hours=1))
    return {"Authorization": f"Bearer {token}"}


# ─── Test suite ──────────────────────────────────────────────────────────────

class TestTasksAPI(unittest.TestCase):

    def setUp(self):
        """Setup headers for ASHA1, ASHA2, DHO, ADMIN."""
        self.asha1_headers = _headers(ASHA1_ID, UserRole.ASHA.value, "ASHA 1")
        self.asha2_headers = _headers(ASHA2_ID, UserRole.ASHA.value, "ASHA 2")
        self.dho_headers = _headers(DHO_ID, UserRole.DHO.value, "DHO Officer")
        self.admin_headers = _headers(ADMIN_ID, UserRole.ADMIN.value, "Admin User")

    # ── Test 1: Authenticated Create ─────────────────────────────────────────

    def test_01_authenticated_create_task(self):
        """POST /api/v1/tasks/ creates a task and returns 201."""
        res = client.post("/api/v1/tasks/", json={
            "title": "Rekha Patil - ANC Post-Discharge Visit",
            "category": "ANC Care",
            "urgency": "EMERGENCY",
        }, headers=self.asha1_headers)

        self.assertEqual(res.status_code, 201, res.text)
        data = res.json()
        self.assertEqual(data["title"], "Rekha Patil - ANC Post-Discharge Visit")
        self.assertEqual(data["category"], "ANC Care")
        self.assertEqual(data["urgency"], "EMERGENCY")
        self.assertFalse(data["visited"])
        self.assertEqual(data["created_by"], ASHA1_ID)
        self.assertIn("id", data)

    # ── Test 2: List Tasks for ASHA ──────────────────────────────────────────

    def test_02_list_tasks(self):
        """GET /api/v1/tasks/ lists tasks belonging to the current user."""
        title = f"Test Task {uuid4().hex[:6]}"
        create_res = client.post("/api/v1/tasks/", json={
            "title": title,
            "category": "General",
            "urgency": "ROUTINE",
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201)

        list_res = client.get("/api/v1/tasks/", headers=self.asha1_headers)
        self.assertEqual(list_res.status_code, 200, list_res.text)
        tasks = list_res.json()
        self.assertIsInstance(tasks, list)
        self.assertTrue(any(t["title"] == title for t in tasks))

    # ── Test 3: Update Visited / Status / Title ──────────────────────────────

    def test_03_update_task_visited_and_details(self):
        """PATCH /api/v1/tasks/{id} updates task fields."""
        create_res = client.post("/api/v1/tasks/", json={
            "title": "Sunita Kamble - TB Medication Day 14 Followup",
            "category": "TB Dots",
            "urgency": "URGENT",
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201)
        task_id = create_res.json()["id"]

        patch_res = client.patch(f"/api/v1/tasks/{task_id}", json={
            "visited": True,
            "urgency": "ROUTINE",
            "title": "Sunita Kamble - Completed TB Visit",
        }, headers=self.asha1_headers)

        self.assertEqual(patch_res.status_code, 200, patch_res.text)
        updated = patch_res.json()
        self.assertTrue(updated["visited"])
        self.assertEqual(updated["urgency"], "ROUTINE")
        self.assertEqual(updated["title"], "Sunita Kamble - Completed TB Visit")

    # ── Test 4: Delete Task ──────────────────────────────────────────────────

    def test_04_delete_task(self):
        """DELETE /api/v1/tasks/{id} deletes the task."""
        create_res = client.post("/api/v1/tasks/", json={
            "title": "Temporary Task To Delete",
            "category": "General",
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201)
        task_id = create_res.json()["id"]

        del_res = client.delete(f"/api/v1/tasks/{task_id}", headers=self.asha1_headers)
        self.assertEqual(del_res.status_code, 204)

        get_res = client.get(f"/api/v1/tasks/{task_id}", headers=self.asha1_headers)
        self.assertEqual(get_res.status_code, 404)

    # ── Test 5: Isolation — ASHA2 cannot access ASHA1's task ──────────────────

    def test_05_asha2_cannot_access_asha1_task(self):
        """ASHA2 receives 404 when attempting to view/modify ASHA1's task."""
        create_res = client.post("/api/v1/tasks/", json={
            "title": "ASHA1 Private Task",
            "category": "Private",
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201)
        task_id = create_res.json()["id"]

        # ASHA2 GET by ID should return 404
        get_res = client.get(f"/api/v1/tasks/{task_id}", headers=self.asha2_headers)
        self.assertEqual(get_res.status_code, 404)

        # ASHA2 list should not contain ASHA1's task
        list_res = client.get("/api/v1/tasks/", headers=self.asha2_headers)
        self.assertEqual(list_res.status_code, 200)
        asha2_task_ids = [t["id"] for t in list_res.json()]
        self.assertNotIn(task_id, asha2_task_ids)

        # ASHA2 PATCH should return 404
        patch_res = client.patch(f"/api/v1/tasks/{task_id}", json={"visited": True}, headers=self.asha2_headers)
        self.assertEqual(patch_res.status_code, 404)

    # ── Test 6: DHO and ADMIN can access all tasks ───────────────────────────

    def test_06_dho_admin_can_access_all_tasks(self):
        """DHO and ADMIN roles can view all tasks across all users."""
        create_res = client.post("/api/v1/tasks/", json={
            "title": "ASHA1 Task For DHO Inspection",
            "category": "Immunization",
        }, headers=self.asha1_headers)
        self.assertEqual(create_res.status_code, 201)
        task_id = create_res.json()["id"]

        # DHO can GET by ID
        dho_get = client.get(f"/api/v1/tasks/{task_id}", headers=self.dho_headers)
        self.assertEqual(dho_get.status_code, 200, dho_get.text)

        # DHO list contains ASHA1's task
        dho_list = client.get("/api/v1/tasks/", headers=self.dho_headers)
        self.assertEqual(dho_list.status_code, 200)
        self.assertTrue(any(t["id"] == task_id for t in dho_list.json()))

        # ADMIN can GET by ID
        admin_get = client.get(f"/api/v1/tasks/{task_id}", headers=self.admin_headers)
        self.assertEqual(admin_get.status_code, 200, admin_get.text)

    # ── Test 7: Unauthenticated Access Returns 401 ──────────────────────────

    def test_07_unauthenticated_returns_401(self):
        """Requests without Authorization header return 401 Unauthorized."""
        res_post = client.post("/api/v1/tasks/", json={"title": "No Auth Task"})
        self.assertEqual(res_post.status_code, 401)

        res_get = client.get("/api/v1/tasks/")
        self.assertEqual(res_get.status_code, 401)

        res_patch = client.patch(f"/api/v1/tasks/{uuid4()}", json={"visited": True})
        self.assertEqual(res_patch.status_code, 401)

        res_del = client.delete(f"/api/v1/tasks/{uuid4()}")
        self.assertEqual(res_del.status_code, 401)

    # ── Test 8: Non-existent Task Returns 404 ────────────────────────────────

    def test_08_nonexistent_task_returns_404(self):
        """GET/PATCH/DELETE for a non-existent UUID returns 404."""
        random_id = uuid4()
        res_get = client.get(f"/api/v1/tasks/{random_id}", headers=self.asha1_headers)
        self.assertEqual(res_get.status_code, 404)

        res_patch = client.patch(f"/api/v1/tasks/{random_id}", json={"visited": True}, headers=self.asha1_headers)
        self.assertEqual(res_patch.status_code, 404)

        res_del = client.delete(f"/api/v1/tasks/{random_id}", headers=self.asha1_headers)
        self.assertEqual(res_del.status_code, 404)


if __name__ == "__main__":
    unittest.main()
