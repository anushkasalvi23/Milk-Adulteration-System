"""Optional MongoDB Atlas storage for prediction output.

Enabled by setting `MONGODB_URI`. Without it the API runs exactly as before. A
database failure is logged and never fails a prediction request.

Collections (database `MONGODB_DB`, default `milk_adulteration`):
  predictions  one document per /predict call
  batches      one document per /predict/batch call: summary plus per-row results
"""

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

log = logging.getLogger(__name__)


def _load_dotenv() -> None:
    """Read MONGODB_* from the nearest .env (cwd or a parent) so `uvicorn` picks them up."""
    here = Path.cwd().resolve()
    for folder in (here, *here.parents):
        env = folder / ".env"
        if env.is_file():
            for line in env.read_text(encoding="utf-8").splitlines():
                key, sep, value = line.partition("=")
                key = key.strip()
                if sep and key.startswith("MONGODB_"):
                    os.environ.setdefault(key, value.strip().strip("\"'"))
            return


class ResultStore:
    def __init__(self, uri: str, db_name: str = "milk_adulteration") -> None:
        from pymongo import MongoClient

        self._client = MongoClient(uri, serverSelectionTimeoutMS=5000, tz_aware=True)
        self._db = self._client[db_name]

    @classmethod
    def from_env(cls) -> ResultStore | None:
        _load_dotenv()
        uri = os.environ.get("MONGODB_URI")
        if not uri:
            return None
        return cls(uri, os.environ.get("MONGODB_DB", "milk_adulteration"))

    def ping(self) -> bool:
        try:
            self._client.admin.command("ping")
            return True
        except Exception:
            log.exception("MongoDB ping failed")
            return False

    def save_prediction(self, prediction: dict[str, Any]) -> str | None:
        return self._insert("predictions", prediction)

    def save_batch(self, response: dict[str, Any], source: str, filename: str | None) -> str | None:
        """Store the batch document, plus one `predictions` document per row."""
        batch_id = self._insert("batches", {**response, "source": source, "filename": filename})
        if batch_id is None:
            return None
        now = datetime.now(timezone.utc)
        rows = [
            {
                **r,
                "collection_point": filename,
                "model_version": response["model_version"],
                "batch_id": batch_id,
                "created_at": now,
            }
            for r in response["results"]
        ]
        try:
            if rows:
                self._db["predictions"].insert_many(rows)
        except Exception:
            log.exception("Could not store batch rows in MongoDB")
        return batch_id

    def recent(self, collection: str, limit: int = 20) -> list[dict[str, Any]]:
        docs = self._db[collection].find().sort([("created_at", -1), ("row", 1)]).limit(limit)
        return [{**d, "_id": str(d["_id"])} for d in docs]

    def clear(self, collection: str) -> int:
        return self._db[collection].delete_many({}).deleted_count

    def _insert(self, collection: str, doc: dict[str, Any]) -> str | None:
        try:
            doc = {**doc, "created_at": datetime.now(timezone.utc)}
            return str(self._db[collection].insert_one(doc).inserted_id)
        except Exception:
            log.exception("Could not store result in MongoDB collection %r", collection)
            return None
