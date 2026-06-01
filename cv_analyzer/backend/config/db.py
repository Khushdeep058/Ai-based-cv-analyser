# backend/config/db.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from your .env file
load_dotenv()

def get_database():
    # Fetch the URI from the environment, fallback to localhost for local testing
    CONNECTION_STRING = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    
    try:
        client = MongoClient(CONNECTION_STRING)
        # Create or connect to a database named 'smarrtif_cv_db'
        db = client['smarrtif_cv_db']
        print("✅ Successfully connected to MongoDB")
        return db
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None