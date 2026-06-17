"""
MongoDB baglantisini dogrular.

Kullanim:
  cd backend
  python -m scripts.test_connection
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.config import settings
from app.database import close_mongodb_connection, connect_to_mongodb, get_database


async def main() -> int:
    print(f"MongoDB URI: {settings.mongodb_uri}")
    print(f"Veritabani: {settings.mongodb_db_name}")

    try:
        await connect_to_mongodb()
        db = get_database()

        ping_result = await db.command("ping")
        collections = await db.list_collection_names()

        print("Baglanti basarili.")
        print(f"Ping: {ping_result}")
        print(f"Mevcut koleksiyon sayisi: {len(collections)}")
        if collections:
            print(f"Koleksiyonlar: {', '.join(sorted(collections))}")
        else:
            print("Henuz koleksiyon yok. Veri aktarimini tamamladiktan sonra tekrar calistirabilirsiniz.")

        return 0
    except Exception as exc:
        print(f"Baglanti hatasi: {exc}", file=sys.stderr)
        print(
            "MongoDB calisiyor mu? Once proje kokunde: docker compose up -d",
            file=sys.stderr,
        )
        return 1
    finally:
        await close_mongodb_connection()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
