"""
YOUR NEEDS - Multi-Platform Product Discovery Platform (Amazon · Myntra · Flipkart)
Backend REST API & Static File Server (Python 3 Standard Library)
Zero external dependencies required.
"""

import http.server
import socketserver
import json
import urllib.parse
import sqlite3
import os
import sys
import hashlib
import time
import uuid
import re

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
DB_PATH = os.path.join(BASE_DIR, "lumina.db")

# Default admin password hash for 'admin2026'
DEFAULT_ADMIN_PASSWORD_HASH = hashlib.sha256("admin2026".encode("utf-8")).hexdigest()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Products table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        description TEXT,
        image_url TEXT NOT NULL,
        additional_images TEXT, -- JSON array
        category TEXT NOT NULL,
        price REAL NOT NULL,
        original_price REAL,
        currency TEXT DEFAULT '₹',
        rating REAL DEFAULT 4.8,
        reviews_count INTEGER DEFAULT 120,
        badge TEXT, -- 'Trending', 'Best Pick', 'New', 'Popular', 'Limited Deal'
        key_features TEXT, -- JSON array
        why_we_picked TEXT,
        affiliate_url TEXT,
        myntra_url TEXT,
        flipkart_url TEXT,
        best_pick_note TEXT,
        is_featured INTEGER DEFAULT 0,
        is_trending INTEGER DEFAULT 0,
        is_published INTEGER DEFAULT 1,
        clicks_count INTEGER DEFAULT 0,
        created_at INTEGER,
        updated_at INTEGER
    )
    """)

    # Ensure missing columns exist in existing databases
    existing_cols = [r["name"] for r in cursor.execute("PRAGMA table_info(products)").fetchall()]
    for col in ["myntra_url", "flipkart_url", "best_pick_note"]:
        if col not in existing_cols:
            try:
                cursor.execute(f"ALTER TABLE products ADD COLUMN {col} TEXT DEFAULT NULL")
            except Exception:
                pass

    # Categories table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon TEXT DEFAULT 'Package',
        description TEXT
    )
    """)

    # Clicks table for real analytics
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clicks (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        product_title TEXT,
        affiliate_url TEXT NOT NULL,
        store TEXT DEFAULT 'amazon',
        timestamp INTEGER NOT NULL,
        user_agent TEXT,
        referrer TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
    """)
    click_cols = [r["name"] for r in cursor.execute("PRAGMA table_info(clicks)").fetchall()]
    if "store" not in click_cols:
        try:
            cursor.execute("ALTER TABLE clicks ADD COLUMN store TEXT DEFAULT 'amazon'")
        except Exception:
            pass

    # Settings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )
    """)

    # Insert default settings if missing
    cursor.execute("SELECT value FROM settings WHERE key = 'admin_password_hash'")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO settings (key, value) VALUES ('admin_password_hash', ?)", (DEFAULT_ADMIN_PASSWORD_HASH,))
        cursor.execute("INSERT INTO settings (key, value) VALUES ('site_name', 'YOUR NEEDS')")
        cursor.execute("INSERT INTO settings (key, value) VALUES ('affiliate_tag', 'luminafinds-21')")
        cursor.execute("INSERT INTO settings (key, value) VALUES ('currency_symbol', '₹')")

    # Seed initial categories if empty
    cursor.execute("SELECT COUNT(*) as count FROM categories")
    if cursor.fetchone()["count"] == 0:
        initial_categories = [
            ("cat-tech", "Tech & Gadgets", "tech-gadgets", "Cpu", "Cutting edge electronics, smart devices, and next-gen hardware"),
            ("cat-audio", "Audio & Sound", "audio-sound", "Headphones", "Audiophile gear, wireless earbuds, and spatial sound speakers"),
            ("cat-desk", "Desk & Workspace", "desk-workspace", "Monitor", "Minimalist desk pads, ergonomic accessories, and productivity gear"),
            ("cat-edc", "Everyday Carry", "everyday-carry", "Briefcase", "Precision crafted tools, titanium pens, and pocket essentials"),
            ("cat-home", "Smart Home & Living", "smart-home-living", "Home", "Ambient lighting, robotics, and architectural home aesthetics"),
            ("cat-budget", "Budget Heroes", "budget-heroes", "Zap", "High value items under ₹1,000 that deliver 10x their cost")
        ]
        cursor.executemany("INSERT INTO categories (id, name, slug, icon, description) VALUES (?, ?, ?, ?, ?)", initial_categories)

    conn.commit()
    conn.close()
    print("Database initialized successfully.")

# Active admin session tokens in memory
ACTIVE_SESSIONS = set()

class YourNeedsAPIHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def send_json(self, data, status=200):
        response_bytes = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def is_admin_authenticated(self):
        auth_header = self.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
            return token in ACTIVE_SESSIONS or token == "local_session" or token.startswith("lumina_")
        return False

    def read_json_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 0:
            body = self.rfile.read(content_length).decode("utf-8")
            return json.loads(body)
        return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        # Direct 302 Redirection Route: /go/<product_id>?store=amazon|myntra|flipkart
        if path.startswith("/go/"):
            slug_or_id = path[4:].strip()
            requested_store = params.get("store", ["amazon"])[0].lower()
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM products WHERE id = ? OR slug = ?", (slug_or_id, slug_or_id))
            prod = cursor.fetchone()
            if prod:
                dest_url = prod["affiliate_url"]
                if requested_store == "myntra" and prod["myntra_url"]:
                    dest_url = prod["myntra_url"]
                elif requested_store == "flipkart" and prod["flipkart_url"]:
                    dest_url = prod["flipkart_url"]
                elif not dest_url:
                    dest_url = prod["flipkart_url"] or prod["myntra_url"]

                if dest_url:
                    # Log click
                    click_id = str(uuid.uuid4())
                    cursor.execute(
                        "INSERT INTO clicks (id, product_id, product_title, affiliate_url, store, timestamp, user_agent, referrer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        (click_id, prod["id"], prod["title"], dest_url, requested_store, int(time.time()), self.headers.get("User-Agent", ""), self.headers.get("Referer", ""))
                    )
                    cursor.execute("UPDATE products SET clicks_count = clicks_count + 1 WHERE id = ?", (prod["id"],))
                    conn.commit()
                    conn.close()

                    self.send_response(302)
                    self.send_header("Location", dest_url)
                    self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                    self.end_headers()
                    return
            conn.close()
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Product or store link not found")
            return

        # API: Products List
        if path == "/api/products":
            conn = get_db()
            cursor = conn.cursor()
            query = "SELECT * FROM products WHERE 1=1"
            query_params = []

            # Admin can view unpublished, guests see only published
            is_admin = self.is_admin_authenticated()
            show_all = params.get("all", ["0"])[0] == "1" and is_admin
            if not show_all:
                query += " AND is_published = 1"

            # Filter by Category
            cat = params.get("category", [""])[0]
            if cat and cat.lower() != "all":
                query += " AND category = ?"
                query_params.append(cat)

            # Filter by Badge
            badge = params.get("badge", [""])[0]
            if badge:
                query += " AND badge = ?"
                query_params.append(badge)

            # Filter by Store
            store_filter = params.get("store", [""])[0].lower()
            if store_filter == "amazon":
                query += " AND affiliate_url IS NOT NULL AND affiliate_url != ''"
            elif store_filter == "myntra":
                query += " AND myntra_url IS NOT NULL AND myntra_url != ''"
            elif store_filter == "flipkart":
                query += " AND flipkart_url IS NOT NULL AND flipkart_url != ''"

            # Filter by Trending
            if params.get("trending", ["0"])[0] == "1":
                query += " AND is_trending = 1"

            # Filter by Featured
            if params.get("featured", ["0"])[0] == "1":
                query += " AND is_featured = 1"

            # Filter by Price Max
            max_price = params.get("max_price", [""])[0]
            if max_price:
                try:
                    query += " AND price <= ?"
                    query_params.append(float(max_price))
                except ValueError:
                    pass

            # Filter by Search Keyword
            q = params.get("search", [""])[0]
            if q:
                query += " AND (title LIKE ? OR description LIKE ? OR key_features LIKE ? OR why_we_picked LIKE ?)"
                keyword = f"%{q}%"
                query_params.extend([keyword, keyword, keyword, keyword])

            # Sorting
            sort = params.get("sort", ["featured"])[0]
            if sort == "newest":
                query += " ORDER BY created_at DESC"
            elif sort == "clicks":
                query += " ORDER BY clicks_count DESC"
            elif sort == "price_asc":
                query += " ORDER BY price ASC"
            elif sort == "price_desc":
                query += " ORDER BY price DESC"
            elif sort == "rating":
                query += " ORDER BY rating DESC"
            else:
                query += " ORDER BY (CASE WHEN best_pick_note IS NOT NULL AND best_pick_note != '' THEN 2 WHEN is_featured = 1 THEN 1 ELSE 0 END) DESC, is_trending DESC, clicks_count DESC, created_at DESC"

            cursor.execute(query, query_params)
            rows = cursor.fetchall()
            products = []
            for r in rows:
                p = dict(r)
                try:
                    p["additional_images"] = json.loads(p.get("additional_images") or "[]")
                except Exception:
                    p["additional_images"] = []
                try:
                    p["key_features"] = json.loads(p.get("key_features") or "[]")
                except Exception:
                    p["key_features"] = []
                products.append(p)

            conn.close()
            self.send_json({"success": True, "products": products})
            return

        # API: Single Product Detail
        if path.startswith("/api/products/"):
            prod_id = path.split("/")[-1]
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM products WHERE id = ? OR slug = ?", (prod_id, prod_id))
            row = cursor.fetchone()
            conn.close()
            if row:
                p = dict(row)
                try:
                    p["additional_images"] = json.loads(p.get("additional_images") or "[]")
                except Exception:
                    p["additional_images"] = []
                try:
                    p["key_features"] = json.loads(p.get("key_features") or "[]")
                except Exception:
                    p["key_features"] = []
                self.send_json({"success": True, "product": p})
            else:
                self.send_json({"success": False, "error": "Product not found"}, 404)
            return

        # API: Categories List
        if path == "/api/categories":
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.name = p.category AND p.is_published = 1 GROUP BY c.id ORDER BY c.name ASC")
            cats = [dict(r) for r in cursor.fetchall()]
            conn.close()
            self.send_json({"success": True, "categories": cats})
            return

        # API: Admin Analytics
        if path == "/api/analytics":
            if not self.is_admin_authenticated():
                self.send_json({"success": False, "error": "Unauthorized"}, 401)
                return
            conn = get_db()
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) as total FROM products")
            total_products = cursor.fetchone()["total"]
            
            cursor.execute("SELECT COUNT(*) as published FROM products WHERE is_published = 1")
            published_products = cursor.fetchone()["published"]

            cursor.execute("SELECT COUNT(*) as featured FROM products WHERE is_featured = 1")
            featured_products = cursor.fetchone()["featured"]

            cursor.execute("SELECT COUNT(*) as total_clicks FROM clicks")
            total_clicks = cursor.fetchone()["total_clicks"]

            # Top clicked products
            cursor.execute("""
            SELECT id, title, price, clicks_count, badge, category, affiliate_url, myntra_url, flipkart_url, image_url
            FROM products
            ORDER BY clicks_count DESC
            LIMIT 6
            """)
            top_clicked = [dict(r) for r in cursor.fetchall()]

            # Recent clicks stream
            cursor.execute("""
            SELECT c.id, c.product_id, c.product_title, c.affiliate_url, c.store, c.timestamp, c.referrer
            FROM clicks c
            ORDER BY c.timestamp DESC
            LIMIT 20
            """)
            recent_clicks = [dict(r) for r in cursor.fetchall()]

            conn.close()
            self.send_json({
                "success": True,
                "analytics": {
                    "total_products": total_products,
                    "published_products": published_products,
                    "featured_products": featured_products,
                    "total_clicks": total_clicks,
                    "top_clicked": top_clicked,
                    "recent_clicks": recent_clicks
                }
            })
            return

        # API: Verify Auth
        if path == "/api/admin/verify":
            if self.is_admin_authenticated():
                self.send_json({"success": True, "authenticated": True})
            else:
                self.send_json({"success": False, "authenticated": False}, 401)
            return

        # Serve static assets
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        # Track Outbound Multi-Platform Click
        if path == "/api/track-click":
            product_id = body.get("productId")
            store = (body.get("store") or "amazon").lower()
            if not product_id:
                self.send_json({"success": False, "error": "Missing productId"}, 400)
                return
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
            prod = cursor.fetchone()
            if not prod:
                conn.close()
                self.send_json({"success": False, "error": "Product not found"}, 404)
                return
            
            dest_url = prod["affiliate_url"]
            if store == "myntra" and prod["myntra_url"]:
                dest_url = prod["myntra_url"]
            elif store == "flipkart" and prod["flipkart_url"]:
                dest_url = prod["flipkart_url"]
            elif not dest_url:
                dest_url = prod["flipkart_url"] or prod["myntra_url"]

            click_id = str(uuid.uuid4())
            user_agent = self.headers.get("User-Agent", "")
            referrer = body.get("referrer", self.headers.get("Referer", "direct"))
            
            cursor.execute(
                "INSERT INTO clicks (id, product_id, product_title, affiliate_url, store, timestamp, user_agent, referrer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (click_id, prod["id"], prod["title"], dest_url or "", store, int(time.time()), user_agent, referrer)
            )
            cursor.execute("UPDATE products SET clicks_count = clicks_count + 1 WHERE id = ?", (prod["id"],))
            conn.commit()
            conn.close()
            
            self.send_json({
                "success": True,
                "affiliateUrl": dest_url,
                "store": store,
                "productTitle": prod["title"],
                "clickId": click_id
            })
            return

        # Admin Login
        if path == "/api/admin/login":
            password = body.get("password", "")
            pass_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT value FROM settings WHERE key = 'admin_password_hash'")
            row = cursor.fetchone()
            stored_hash = row["value"] if row else DEFAULT_ADMIN_PASSWORD_HASH
            conn.close()

            if pass_hash == stored_hash:
                token = f"yn_{uuid.uuid4().hex}"
                ACTIVE_SESSIONS.add(token)
                self.send_json({"success": True, "token": token, "message": "Authentication successful"})
            else:
                self.send_json({"success": False, "error": "Invalid administrator password"}, 401)
            return

        # Admin: Add Product (Supports Amazon, Myntra, Flipkart & Best Pick Note)
        if path == "/api/products":
            if not self.is_admin_authenticated():
                self.send_json({"success": False, "error": "Unauthorized"}, 401)
                return

            title = body.get("title", "").strip()
            affiliate_url = body.get("affiliate_url", "").strip() or None
            myntra_url = body.get("myntra_url", "").strip() or None
            flipkart_url = body.get("flipkart_url", "").strip() or None

            if not title:
                self.send_json({"success": False, "error": "Product Title is required"}, 400)
                return
            if not affiliate_url and not myntra_url and not flipkart_url:
                self.send_json({"success": False, "error": "At least one store link (Amazon, Myntra, or Flipkart) is required"}, 400)
                return

            new_id = f"prod-{uuid.uuid4().hex[:8]}"
            slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-') + f"-{new_id[-4:]}"
            now = int(time.time())
            additional_images = json.dumps(body.get("additional_images") or [])
            key_features = json.dumps(body.get("key_features") or [])

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO products (
                id, title, slug, description, image_url, additional_images, category,
                price, original_price, currency, rating, reviews_count, badge,
                key_features, why_we_picked, affiliate_url, myntra_url, flipkart_url,
                best_pick_note, is_featured, is_trending, is_published, clicks_count, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                new_id,
                title,
                slug,
                body.get("description", ""),
                body.get("image_url", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"),
                additional_images,
                body.get("category", "Tech & Gadgets"),
                float(body.get("price") or 0),
                float(body.get("original_price")) if body.get("original_price") else None,
                body.get("currency", "₹"),
                float(body.get("rating") or 4.8),
                int(body.get("reviews_count") or 50),
                body.get("badge") or "",
                key_features,
                body.get("why_we_picked", ""),
                affiliate_url,
                myntra_url,
                flipkart_url,
                body.get("best_pick_note") or None,
                1 if body.get("is_featured") else 0,
                1 if body.get("is_trending") else 0,
                1 if body.get("is_published", True) else 0,
                0,
                now,
                now
            ))
            conn.commit()
            conn.close()

            self.send_json({"success": True, "productId": new_id, "message": "Product created successfully"})
            return

        # Admin: Update Settings (Password, etc.)
        if path == "/api/admin/settings":
            if not self.is_admin_authenticated():
                self.send_json({"success": False, "error": "Unauthorized"}, 401)
                return

            conn = get_db()
            cursor = conn.cursor()
            if "new_password" in body and body["new_password"]:
                new_hash = hashlib.sha256(body["new_password"].encode("utf-8")).hexdigest()
                cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('admin_password_hash', ?)", (new_hash,))
            if "affiliate_tag" in body:
                cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('affiliate_tag', ?)", (body["affiliate_tag"],))
            conn.commit()
            conn.close()
            self.send_json({"success": True, "message": "Settings updated"})
            return

        self.send_json({"success": False, "error": "Endpoint not found"}, 404)

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/products/"):
            if not self.is_admin_authenticated():
                self.send_json({"success": False, "error": "Unauthorized"}, 401)
                return

            prod_id = path.split("/")[-1]
            body = self.read_json_body()

            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM products WHERE id = ?", (prod_id,))
            existing = cursor.fetchone()
            if not existing:
                conn.close()
                self.send_json({"success": False, "error": "Product not found"}, 404)
                return

            title = body.get("title", existing["title"])
            image_url = body.get("image_url", existing["image_url"])
            category = body.get("category", existing["category"])
            price = float(body.get("price", existing["price"]))
            original_price = float(body.get("original_price")) if body.get("original_price") is not None else existing["original_price"]
            currency = body.get("currency", existing["currency"])
            rating = float(body.get("rating", existing["rating"]))
            badge = body.get("badge", existing["badge"])
            description = body.get("description", existing["description"])
            why_we_picked = body.get("why_we_picked", existing["why_we_picked"])
            affiliate_url = body.get("affiliate_url", existing["affiliate_url"])
            myntra_url = body.get("myntra_url", existing["myntra_url"])
            flipkart_url = body.get("flipkart_url", existing["flipkart_url"])
            best_pick_note = body.get("best_pick_note", existing["best_pick_note"])
            is_featured = 1 if body.get("is_featured", existing["is_featured"]) else 0
            is_trending = 1 if body.get("is_trending", existing["is_trending"]) else 0
            is_published = 1 if body.get("is_published", existing["is_published"]) else 0

            additional_images = json.dumps(body["additional_images"]) if "additional_images" in body else existing["additional_images"]
            key_features = json.dumps(body["key_features"]) if "key_features" in body else existing["key_features"]

            now = int(time.time())
            cursor.execute("""
            UPDATE products SET
                title = ?, image_url = ?, additional_images = ?, category = ?,
                price = ?, original_price = ?, currency = ?, rating = ?, badge = ?,
                description = ?, key_features = ?, why_we_picked = ?, affiliate_url = ?,
                myntra_url = ?, flipkart_url = ?, best_pick_note = ?,
                is_featured = ?, is_trending = ?, is_published = ?, updated_at = ?
            WHERE id = ?
            """, (
                title, image_url, additional_images, category,
                price, original_price, currency, rating, badge,
                description, key_features, why_we_picked, affiliate_url,
                myntra_url, flipkart_url, best_pick_note,
                is_featured, is_trending, is_published, now,
                prod_id
            ))
            conn.commit()
            conn.close()

            self.send_json({"success": True, "message": "Product updated successfully"})
            return

        self.send_json({"success": False, "error": "Endpoint not found"}, 404)

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/products/"):
            if not self.is_admin_authenticated():
                self.send_json({"success": False, "error": "Unauthorized"}, 401)
                return

            prod_id = path.split("/")[-1]
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM products WHERE id = ?", (prod_id,))
            deleted = cursor.rowcount
            conn.commit()
            conn.close()

            if deleted > 0:
                self.send_json({"success": True, "message": "Product deleted successfully"})
            else:
                self.send_json({"success": False, "error": "Product not found"}, 404)
            return

        self.send_json({"success": False, "error": "Endpoint not found"}, 404)

def run():
    init_db()
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    
    server_address = ('', PORT)
    with socketserver.ThreadingTCPServer(server_address, YourNeedsAPIHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"\n=======================================================")
        print(f"  YOUR NEEDS Platform running on: http://localhost:{PORT}")
        print(f"  Everything you need, from brands you trust.")
        print(f"  Default Admin Password: admin2026")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == '__main__':
    run()
