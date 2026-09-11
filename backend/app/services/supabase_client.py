import logging
from typing import Optional
# pyrefly: ignore [missing-import]
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)


def get_supabase_client() -> Optional[Client]:
    """
    Creates and returns a Supabase client instance using configuration settings.
    Handles missing or placeholder credentials gracefully.
    """
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY

    if not url or "your-supabase-project" in url or not key or "your-supabase" in key:
        logger.warning(
            "SUPABASE_URL or SUPABASE_KEY is using default placeholder credentials. "
            "Database connections will fail until valid credentials are provided in backend/.env."
        )
        return None

    try:
        return create_client(url, key)
    except Exception as err:
        logger.error(f"Failed to initialize Supabase client: {err}")
        return None


# Lazy global instance
supabase: Optional[Client] = get_supabase_client()
