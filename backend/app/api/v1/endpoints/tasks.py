from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.task import (
    TaskCreate,
    TaskOut,
    TaskUpdate,
    TaskUrgencyEnum,
)
from app.schemas.auth import UserOut, UserRole
from app.api.deps import get_current_user
from app.services.supabase_client import supabase

router = APIRouter()

# Local in-memory fallback store for demo/offline mode
_in_memory_tasks: List[dict] = []


def _row_to_out(row: dict) -> TaskOut:
    """Convert a raw DB or in-memory row dict to TaskOut."""
    created_at = row.get("created_at")
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    updated_at = row.get("updated_at")
    if isinstance(updated_at, str):
        updated_at = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))

    return TaskOut(
        id=UUID(str(row["id"])),
        created_by=UUID(str(row["created_by"])) if row.get("created_by") else None,
        title=row["title"],
        category=row.get("category", "General"),
        urgency=TaskUrgencyEnum(row.get("urgency", "ROUTINE")),
        visited=bool(row.get("visited", False)),
        created_at=created_at or datetime.now(timezone.utc),
        updated_at=updated_at or datetime.now(timezone.utc),
    )


@router.post(
    "/",
    response_model=TaskOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task / reminder",
)
def create_task(
    task_in: TaskCreate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Create a new task / reminder.
    Associates the task with the authenticated user as created_by.
    """
    task_id = uuid4()
    now_iso = datetime.now(timezone.utc).isoformat()

    record = {
        "id": str(task_id),
        "created_by": str(current_user.id),
        "title": task_in.title.strip(),
        "category": task_in.category or "General",
        "urgency": task_in.urgency.value,
        "visited": False,
        "created_at": now_iso,
        "updated_at": now_iso,
    }

    if supabase is not None:
        try:
            res = supabase.table("tasks").insert({
                "id": str(task_id),
                "created_by": str(current_user.id),
                "title": task_in.title.strip(),
                "category": task_in.category or "General",
                "urgency": task_in.urgency.value,
                "visited": False,
            }).execute()
            if res.data and len(res.data) > 0:
                return _row_to_out(res.data[0])
        except Exception:
            pass

    _in_memory_tasks.append(record)
    return _row_to_out(record)


@router.get(
    "/",
    response_model=List[TaskOut],
    summary="List tasks (ASHA: own only; DHO/ADMIN: all)",
)
def list_tasks(
    current_user: UserOut = Depends(get_current_user),
):
    """
    List tasks.
    - ASHA: only tasks created by themselves.
    - DHO / HOSPITAL / ADMIN: all tasks across all users.
    """
    is_privileged = current_user.role in (UserRole.DHO, UserRole.HOSPITAL, UserRole.ADMIN)

    if supabase is not None:
        try:
            query = supabase.table("tasks").select("*")
            if not is_privileged:
                query = query.eq("created_by", str(current_user.id))

            res = query.order("created_at", desc=True).execute()
            if res.data is not None:
                return [_row_to_out(row) for row in res.data]
        except Exception:
            pass

    # Fallback to in-memory store
    if is_privileged:
        filtered = list(_in_memory_tasks)
    else:
        filtered = [t for t in _in_memory_tasks if t.get("created_by") == str(current_user.id)]

    return [_row_to_out(t) for t in filtered]


@router.get(
    "/{task_id}",
    response_model=TaskOut,
    summary="Get a specific task by ID",
)
def get_task(
    task_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Retrieve a specific task record by its UUID.
    ASHA workers can only access their own tasks.
    Returns 404 if not found or unauthorized.
    """
    is_privileged = current_user.role in (UserRole.DHO, UserRole.HOSPITAL, UserRole.ADMIN)

    if supabase is not None:
        try:
            res = supabase.table("tasks").select("*").eq("id", str(task_id)).execute()
            if res.data and len(res.data) > 0:
                row = res.data[0]
                if not is_privileged and str(row.get("created_by")) != str(current_user.id):
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Task with ID '{task_id}' not found",
                    )
                return _row_to_out(row)
        except HTTPException:
            raise
        except Exception:
            pass

    for t in _in_memory_tasks:
        if str(t["id"]) == str(task_id):
            if not is_privileged and str(t.get("created_by")) != str(current_user.id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Task with ID '{task_id}' not found",
                )
            return _row_to_out(t)

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Task with ID '{task_id}' not found",
    )


@router.patch(
    "/{task_id}",
    response_model=TaskOut,
    summary="Update title, category, urgency, or visited status of a task",
)
def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Update a task record.
    ASHA workers can only update their own tasks.
    """
    # Verify task access first
    target_task = get_task(task_id, current_user)

    update_fields: dict = {}
    if task_update.title is not None:
        update_fields["title"] = task_update.title.strip()
    if task_update.category is not None:
        update_fields["category"] = task_update.category.strip()
    if task_update.urgency is not None:
        update_fields["urgency"] = task_update.urgency.value
    if task_update.visited is not None:
        update_fields["visited"] = task_update.visited

    if not update_fields:
        return target_task

    update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()

    if supabase is not None:
        try:
            res = supabase.table("tasks").update(update_fields).eq("id", str(task_id)).execute()
            if res.data and len(res.data) > 0:
                return _row_to_out(res.data[0])
        except Exception:
            pass

    for idx, t in enumerate(_in_memory_tasks):
        if str(t["id"]) == str(task_id):
            updated = {**t, **update_fields}
            _in_memory_tasks[idx] = updated
            return _row_to_out(updated)

    return get_task(task_id, current_user)


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
)
def delete_task(
    task_id: UUID,
    current_user: UserOut = Depends(get_current_user),
):
    """
    Delete a task by ID.
    ASHA workers can only delete their own tasks.
    """
    # Verify task access first
    get_task(task_id, current_user)

    if supabase is not None:
        try:
            supabase.table("tasks").delete().eq("id", str(task_id)).execute()
            # Also clean up from in-memory fallback if present
            for idx, t in enumerate(_in_memory_tasks):
                if str(t["id"]) == str(task_id):
                    _in_memory_tasks.pop(idx)
                    break
            return
        except Exception:
            pass

    for idx, t in enumerate(_in_memory_tasks):
        if str(t["id"]) == str(task_id):
            _in_memory_tasks.pop(idx)
            return

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Task with ID '{task_id}' not found",
    )
