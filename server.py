from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
import os
from urllib.parse import urlparse
import planner

DATABASE = 'wardrobe_system.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS apparel (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            image_data TEXT NOT NULL,
            category TEXT NOT NULL,
            tags TEXT NOT NULL
        )
    ''')
    
    # Migration check: ensure category and tags columns exist on existing databases
    cursor.execute("PRAGMA table_info(apparel)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'category' not in columns:
        cursor.execute("ALTER TABLE apparel ADD COLUMN category TEXT NOT NULL DEFAULT 'General'")
    if 'tags' not in columns:
        cursor.execute("ALTER TABLE apparel ADD COLUMN tags TEXT NOT NULL DEFAULT 'Standard'")

    conn.commit()
    conn.close()

class SecurityAuthHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    def serve_static_file(self, file_path, content_type):
        if os.path.exists(file_path) and os.path.isfile(file_path):
            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-Type', content_type)
            self.end_headers()
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path_str = parsed_path.path

        if path_str in ['/', '/index.html']:
            self.serve_static_file('index.html', 'text/html')
        elif path_str in ['/login.html', '/register.html', '/wardrobe.html', '/upload.html', '/analysis.html', '/profile.html']:
            self.serve_static_file(path_str.lstrip('/'), 'text/html')
        elif path_str.startswith('/css/'):
            self.serve_static_file(path_str.lstrip('/'), 'text/css')
        elif path_str.startswith('/js/'):
            self.serve_static_file(path_str.lstrip('/'), 'application/javascript')
        elif path_str == '/api/apparel':
            conn = sqlite3.connect(DATABASE)
            cursor = conn.cursor()
            cursor.execute("SELECT title, image_data, category, tags FROM apparel ORDER BY id DESC")
            items = cursor.fetchall()
            conn.close()
            payload = [{"title": row[0], "image": row[1], "category": row[2], "tags": row[3]} for row in items]
            
            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(payload).encode('utf-8'))
        elif path_str == '/api/planner/recommend':
            query_components = dict(qc.split("=") for qc in parsed_path.query.split("&") if "=" in qc)
            lat = float(query_components.get("lat", 18.5204))
            lon = float(query_components.get("lon", 73.8567))

            conn = sqlite3.connect(DATABASE)
            cursor = conn.cursor()
            cursor.execute("SELECT title, image_data, category, tags FROM apparel")
            db_items = cursor.fetchall()
            conn.close()

            result = planner.generate_outfit_recommendation(db_items, lat=lat, lon=lon)

            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
        elif path_str == '/api/user/profile':
            auth_header = self.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer token-'):
                self.send_response(401)
                self.end_headers()
                return

            username = auth_header.replace('Bearer token-', '').strip()
            
            conn = sqlite3.connect(DATABASE)
            cursor = conn.cursor()
            
            cursor.execute("SELECT username, email FROM users WHERE username = ?", (username,))
            user = cursor.fetchone()
            
            cursor.execute("SELECT category, COUNT(*) FROM apparel GROUP BY category")
            category_counts = cursor.fetchall()
            
            cursor.execute("SELECT COUNT(*) FROM apparel")
            total_items = cursor.fetchone()[0]
            
            conn.close()

            if not user:
                self.send_response(404)
                self.end_headers()
                return

            payload = {
                "username": user[0],
                "email": user[1],
                "stats": {
                    "total_items": total_items,
                    "categories": {row[0]: row[1] for row in category_counts}
                }
            }

            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(payload).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        parsed_path = urlparse(self.path)
        content_length = int(self.headers['Content-Length'])
        post_data = json.loads(self.rfile.read(content_length).decode('utf-8'))
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        if parsed_path.path == '/auth/register':
            username = post_data.get('username', '').strip()
            email = post_data.get('email', '').lower().strip()
            password = post_data.get('password')

            if not username or not email or not password:
                self.send_response(400)
                self._set_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"message": "All fields are required."}).encode('utf-8'))
                conn.close()
                return

            try:
                cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                               (username, email, password))
                conn.commit()
                conn.close()

                self.send_response(201)
                self._set_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"message": "Registration successful!"}).encode('utf-8'))
            except sqlite3.IntegrityError:
                conn.close()
                self.send_response(409)
                self._set_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"message": "Email already exists."}).encode('utf-8'))

        elif parsed_path.path == '/auth/login':
            email = post_data.get('email', '').lower().strip()
            password = post_data.get('password')
            cursor.execute("SELECT username, email FROM users WHERE email = ? AND password = ?", (email, password))
            user = cursor.fetchone()
            conn.close()
            if user:
                self.send_response(200)
                self._set_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"token": f"token-{user[0]}", "username": user[0]}).encode('utf-8'))
            else:
                self.send_response(401)
                self._set_cors_headers()
                self.end_headers()

        elif parsed_path.path == '/api/apparel/upload':
            title = post_data.get('title', 'Garment Item')
            raw_image = post_data.get('image')
            category = post_data.get('category', 'General')
            tags = post_data.get('tags', 'Standard')

            cursor.execute("INSERT INTO apparel (title, image_data, category, tags) VALUES (?, ?, ?, ?)",
                           (title, raw_image, category, tags))
            conn.commit()
            conn.close()

            self.send_response(201)
            self._set_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"message": "Item saved successfully."}).encode('utf-8'))

        else:
            conn.close()
            self.send_response(404)
            self.end_headers()

def run_server():
    init_db()
    print("Server running on http://127.0.0.1:8000...")
    HTTPServer(('127.0.0.1', 8000), SecurityAuthHandler).serve_forever()

if __name__ == '__main__':
    run_server()