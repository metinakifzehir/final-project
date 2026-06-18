from pymongo import MongoClient
import re
import os
from dotenv import load_dotenv

# --- Connection Details ---
# Load environment variables from .env file located in the parent directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)


DATABASE_NAME = os.getenv("MONGODB_DB_NAME")
COLLECTION_NAME = "users"

MONGO_URI = os.getenv("MONGODB_URI")
# --------------------------

def update_user_credentials():
    """
    Updates all users in the collection to have a username and password
    derived from their author_link.

    The username and password will be set to the numeric ID found in the
    'author_link' URL.
    """
    if not MONGO_URI:
        print("Error: MongoDB connection details are missing.")
        print("Please ensure MONGODB_ROOT_USERNAME, MONGODB_ROOT_PASSWORD, and MONGODB_DB_NAME are set in your .env file.")
        return

    try:
        # Establish a connection to the MongoDB server
        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]

        # Find all documents in the collection
        users_to_update = list(collection.find({}))
        print(f"Found {len(users_to_update)} users to process.")

        updated_count = 0
        for user in users_to_update:
            author_link = user.get("author_link")

            if not author_link:
                print(f"Skipping user {user.get('_id')} because 'author_link' is missing.")
                continue

            # Use regex to extract the numeric ID from the author_link
            match = re.search(r'/contrib/(\d+)/', author_link)
            if not match:
                print(f"Skipping user {user.get('_id')}: could not extract ID from link: {author_link}")
                continue

            user_id = match.group(1)

            # --- IMPORTANT SECURITY NOTE ---
            # Storing passwords in plaintext is highly insecure.
            password = user_id

            # Prepare the update operation
            update_query = {"_id": user["_id"]}
            new_values = {
                "$set": {
                    "username": user_id,
                    "password": password
                }
            }

            # Perform the update for the current user
            result = collection.update_one(update_query, new_values)
            if result.modified_count > 0:
                updated_count += 1
                print(f"Updated user {user['_id']} with username '{user_id}'")

        print(f"\nUpdate complete. {updated_count} of {len(users_to_update)} user(s) were updated.")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # Ensure the client connection is closed
        if 'client' in locals() and client:
            client.close()
            print("MongoDB connection closed.")

# --- How to run this script ---
# 1. Make sure you have the required libraries installed:
#    pip install pymongo python-dotenv
# 2. Create a .env file in the 'backend' directory with your MongoDB credentials.
# 3. To execute the update, uncomment the function call below.
#
if __name__ == "__main__":
    print("Starting the user update script...")
    update_user_credentials()
    print("Script finished. The update function is currently commented out.")
    print("To run the database update, you must uncomment the call to 'update_user_credentials()' in this file.")
