# backend/models/profile_model.py
from config.db import get_database
import datetime

def save_analyzed_profile(profile_data):
    """
    Saves the analyzed candidate profile to MongoDB.
    Appends a UTC timestamp to the saved payload.
    """
    db = get_database()
    if db is None:
        raise Exception("Database connection not available")
    
    # Add a created_at timestamp
    profile_data["created_at"] = datetime.datetime.utcnow()
    
    # Save profile in the 'profiles' collection
    collection = db['profiles']
    result = collection.insert_one(profile_data)
    
    return result.inserted_id
