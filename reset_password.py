"""
LUMINA - Command Line Password Reset Utility
Run this script to set or reset your administrator password directly in the database.
Usage: python reset_password.py [new_password]
"""

import sqlite3
import hashlib
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "lumina.db")

def set_password(new_pass):
    if len(new_pass) < 4:
        print("Error: Password should be at least 4 characters.")
        return False
    
    pass_hash = hashlib.sha256(new_pass.encode("utf-8")).hexdigest()
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password_hash', ?)", (pass_hash,))
    conn.commit()
    conn.close()
    
    print("\n" + "=" * 55)
    print("  LUMINA MASTER PASSWORD UPDATED SUCCESSFULLY!")
    print(f"  New Password: {new_pass}")
    print("=" * 55 + "\n")
    return True

if __name__ == '__main__':
    if len(sys.argv) > 1:
        new_password = sys.argv[1].strip()
    else:
        new_password = input("Enter new administrator password: ").strip()
    
    set_password(new_password)
