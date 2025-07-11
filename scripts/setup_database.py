# Database setup script for PostgreSQL
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    """Create the collaborative editor database and tables"""
    
    # Database connection parameters
    DB_CONFIG = {
        'host': 'localhost',
        'port': 5432,
        'user': 'postgres',
        'password': 'password'
    }
    
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(**DB_CONFIG)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Create database
        cursor.execute("CREATE DATABASE collaborative_editor;")
        print("Database 'collaborative_editor' created successfully!")
        
        # Close connection to server
        cursor.close()
        conn.close()
        
        # Connect to the new database
        DB_CONFIG['database'] = 'collaborative_editor'
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Create tables
        create_tables_sql = """
        -- Users table
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            avatar_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Documents table
        CREATE TABLE documents (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            created_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            version INTEGER DEFAULT 1,
            is_public BOOLEAN DEFAULT FALSE
        );
        
        -- Document collaborators table
        CREATE TABLE document_collaborators (
            id SERIAL PRIMARY KEY,
            document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            permission VARCHAR(20) DEFAULT 'edit', -- 'view', 'edit', 'admin'
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(document_id, user_id)
        );
        
        -- Document versions table (for conflict resolution)
        CREATE TABLE document_versions (
            id SERIAL PRIMARY KEY,
            document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
            content TEXT,
            version INTEGER,
            created_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            operation_type VARCHAR(50), -- 'insert', 'delete', 'replace'
            operation_data JSONB
        );
        
        -- Comments table
        CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id),
            content TEXT NOT NULL,
            position_start INTEGER,
            position_end INTEGER,
            selected_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            resolved BOOLEAN DEFAULT FALSE,
            parent_comment_id INTEGER REFERENCES comments(id)
        );
        
        -- Real-time sessions table
        CREATE TABLE active_sessions (
            id SERIAL PRIMARY KEY,
            document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            socket_id VARCHAR(255),
            cursor_position JSONB,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(document_id, user_id)
        );
        
        -- Operational transforms table (for real-time collaboration)
        CREATE TABLE operations (
            id SERIAL PRIMARY KEY,
            document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id),
            operation_type VARCHAR(50), -- 'retain', 'insert', 'delete'
            operation_data JSONB,
            version INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create indexes for better performance
        CREATE INDEX idx_documents_created_by ON documents(created_by);
        CREATE INDEX idx_document_collaborators_document_id ON document_collaborators(document_id);
        CREATE INDEX idx_document_collaborators_user_id ON document_collaborators(user_id);
        CREATE INDEX idx_comments_document_id ON comments(document_id);
        CREATE INDEX idx_active_sessions_document_id ON active_sessions(document_id);
        CREATE INDEX idx_operations_document_id ON operations(document_id);
        CREATE INDEX idx_operations_version ON operations(document_id, version);
        """
        
        cursor.execute(create_tables_sql)
        conn.commit()
        print("Tables created successfully!")
        
        # Insert sample data
        insert_sample_data(cursor, conn)
        
        cursor.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"Error: {e}")

def insert_sample_data(cursor, conn):
    """Insert sample data for testing"""
    
    sample_data_sql = """
    -- Insert sample users
    INSERT INTO users (username, email, password_hash, full_name) VALUES
    ('john_doe', 'john@example.com', 'hashed_password_1', 'John Doe'),
    ('jane_smith', 'jane@example.com', 'hashed_password_2', 'Jane Smith'),
    ('bob_wilson', 'bob@example.com', 'hashed_password_3', 'Bob Wilson'),
    ('alice_brown', 'alice@example.com', 'hashed_password_4', 'Alice Brown');
    
    -- Insert sample documents
    INSERT INTO documents (title, content, created_by) VALUES
    ('Project Proposal', 'This is a sample project proposal document...', 1),
    ('Meeting Notes', 'Meeting notes from today''s standup...', 2),
    ('Technical Specification', 'Technical requirements and specifications...', 1);
    
    -- Insert collaborators
    INSERT INTO document_collaborators (document_id, user_id, permission) VALUES
    (1, 1, 'admin'),
    (1, 2, 'edit'),
    (1, 3, 'view'),
    (2, 2, 'admin'),
    (2, 1, 'edit'),
    (3, 1, 'admin'),
    (3, 4, 'edit');
    
    -- Insert sample comments
    INSERT INTO comments (document_id, user_id, content, position_start, position_end, selected_text) VALUES
    (1, 2, 'This section needs more detail', 100, 150, 'sample project proposal'),
    (1, 3, 'Agreed, we should expand on the timeline', 0, 0, ''),
    (2, 1, 'Can we schedule a follow-up meeting?', 200, 220, 'standup');
    """
    
    cursor.execute(sample_data_sql)
    conn.commit()
    print("Sample data inserted successfully!")

if __name__ == "__main__":
    create_database()
