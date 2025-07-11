# MongoDB setup script (alternative to PostgreSQL)
from pymongo import MongoClient
from datetime import datetime
import json

def setup_mongodb():
    """Setup MongoDB collections for collaborative editor"""
    
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['collaborative_editor']
    
    # Create collections
    users_collection = db['users']
    documents_collection = db['documents']
    comments_collection = db['comments']
    sessions_collection = db['active_sessions']
    operations_collection = db['operations']
    
    # Create indexes
    users_collection.create_index("username", unique=True)
    users_collection.create_index("email", unique=True)
    documents_collection.create_index("created_by")
    documents_collection.create_index([("title", "text"), ("content", "text")])
    comments_collection.create_index("document_id")
    sessions_collection.create_index("document_id")
    operations_collection.create_index([("document_id", 1), ("version", 1)])
    
    print("MongoDB collections and indexes created successfully!")
    
    # Insert sample data
    insert_sample_mongodb_data(db)

def insert_sample_mongodb_data(db):
    """Insert sample data into MongoDB"""
    
    # Sample users
    users = [
        {
            "_id": "user_1",
            "username": "john_doe",
            "email": "john@example.com",
            "password_hash": "hashed_password_1",
            "full_name": "John Doe",
            "avatar_url": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "_id": "user_2",
            "username": "jane_smith",
            "email": "jane@example.com",
            "password_hash": "hashed_password_2",
            "full_name": "Jane Smith",
            "avatar_url": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "_id": "user_3",
            "username": "bob_wilson",
            "email": "bob@example.com",
            "password_hash": "hashed_password_3",
            "full_name": "Bob Wilson",
            "avatar_url": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]
    
    db.users.insert_many(users)
    
    # Sample documents
    documents = [
        {
            "_id": "doc_1",
            "title": "Project Proposal",
            "content": "This is a sample project proposal document with collaborative editing features...",
            "created_by": "user_1",
            "collaborators": [
                {"user_id": "user_1", "permission": "admin"},
                {"user_id": "user_2", "permission": "edit"},
                {"user_id": "user_3", "permission": "view"}
            ],
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "version": 1,
            "is_public": False
        },
        {
            "_id": "doc_2",
            "title": "Meeting Notes",
            "content": "Meeting notes from today's standup discussion...",
            "created_by": "user_2",
            "collaborators": [
                {"user_id": "user_2", "permission": "admin"},
                {"user_id": "user_1", "permission": "edit"}
            ],
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "version": 1,
            "is_public": False
        }
    ]
    
    db.documents.insert_many(documents)
    
    # Sample comments
    comments = [
        {
            "_id": "comment_1",
            "document_id": "doc_1",
            "user_id": "user_2",
            "content": "This section needs more detail about the implementation timeline",
            "position_start": 100,
            "position_end": 150,
            "selected_text": "collaborative editing features",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "resolved": False,
            "replies": []
        },
        {
            "_id": "comment_2",
            "document_id": "doc_1",
            "user_id": "user_3",
            "content": "Agreed, we should also include budget estimates",
            "position_start": 0,
            "position_end": 0,
            "selected_text": "",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "resolved": False,
            "replies": []
        }
    ]
    
    db.comments.insert_many(comments)
    
    print("Sample data inserted into MongoDB successfully!")

if __name__ == "__main__":
    setup_mongodb()
