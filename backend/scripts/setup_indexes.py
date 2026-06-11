"""
Veri aktarimindan sonra indeksleri olusturmak icin sablon script.

Koleksiyon adlarini ve alan adlarini kendi semaniza gore guncelleyin,
ardindan calistirin:

  cd backend
  python -m scripts.setup_indexes
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.database import close_mongodb_connection, connect_to_mongodb, get_database

# Veri aktarimindan sonra bu sozlugu kendi koleksiyonlariniza gore duzenleyin.
INDEX_DEFINITIONS: dict[str, list] = {
    # "restaurants": [
    #     ([("location", "2dsphere")], {"name": "location_2dsphere"}),
    #     ([("place_id", 1)], {"unique": True, "name": "place_id_unique"}),
    #     ([("category", 1)], {"name": "category_1"}),
    # ],
    # "reviews": [
    #     ([("restaurant_id", 1), ("user_id", 1)], {"name": "restaurant_user"}),
    #     ([("user_id", 1)], {"name": "user_id_1"}),
    # ],
    # "users": [
    #     ([("username", 1)], {"unique": True, "name": "username_unique"}),
    # ],
}


async def setup_indexes() -> None:
    db = get_database()

    if not INDEX_DEFINITIONS:
        print("INDEX_DEFINITIONS bos. Koleksiyon adlarini ekledikten sonra tekrar calistirin.")
        return

    for collection_name, indexes in INDEX_DEFINITIONS.items():
        collection = db[collection_name]
        for keys, options in indexes:
            name = await collection.create_index(keys, **options)
            print(f"{collection_name}: {name} olusturuldu.")


async def main() -> int:
    try:
        await connect_to_mongodb()
        await setup_indexes()
        return 0
    except Exception as exc:
        print(f"Indeks olusturma hatasi: {exc}", file=sys.stderr)
        return 1
    finally:
        await close_mongodb_connection()


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
