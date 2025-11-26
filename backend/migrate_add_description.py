"""
Migration script to add description column to sections table
Run this once to update existing database
"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'app.db')

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if description column exists
        cursor.execute("PRAGMA table_info(sections)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'description' not in columns:
            # Add description column
            cursor.execute("ALTER TABLE sections ADD COLUMN description TEXT DEFAULT ''")
            conn.commit()
            print("✓ Added 'description' column to sections table")
        else:
            print("✓ 'description' column already exists")
    except Exception as e:
        print(f"✗ Error: {e}")
        conn.rollback()
    finally:
        conn.close()
else:
    print("Database file not found. It will be created when you start the server.")
