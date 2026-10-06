# YOUR NEEDS — Everything you need, from brands you trust.

A modern, premium multi-platform product discovery website comparing and curating handpicked products across **Amazon**, **Myntra**, and **Flipkart**.

---

## 🌟 What's New & Core Features

* **Brand Name:** **YOUR NEEDS**
* **Tagline:** *"Everything you need, from brands you trust."*
* **Multi-Platform Affiliate Purchasing:**
  * 🛒 **Buy on Amazon** → Direct Amazon Associates link (`?tag=...`)
  * 🛍️ **Buy on Myntra** → Direct Myntra affiliate link
  * 🛒 **Buy on Flipkart** → Direct Flipkart affiliate link
* **Store Filtering:** Visitors can filter products by store (All Stores, 🛒 Amazon, 🛍️ Myntra, 🛒 Flipkart) or browse all together.
* **Owner's Best Pick Control:**
  * From the Admin Dashboard, you can designate any product as the **Owner's Best Pick** and add a custom highlight note (*"Why this is the best pick"*).
  * Best Pick items automatically receive special spotlight placement and glowing aesthetic rings.
* **Product Guides & Comparisons:**
  * Dedicated editorial comparison cards (*Best Wireless Earbuds 2026*, *Dream Desk Setup Under ₹30k*, *Best Buys Under ₹1,000*).
* **Transparent Legal Compliance:**
  * **Affiliate Disclosure Bar:** *"Some links on this website are affiliate links. If you purchase a product through these links, we may earn a commission at no additional cost to you."*
  * **Amazon Required Disclosure (at the bottom in clean small font):** *"As an Amazon Associate I earn from qualifying purchases."*
  * Dedicated legal modals for Privacy Policy, Terms, and Affiliate Disclosures.

---

## 📁 Where to Find the Files on Your Computer

All files are located in your workspace at:
```text
C:\Users\user\.gemini\antigravity\scratch\lumina-discovery\
```

| File / Folder | What It Contains |
| :--- | :--- |
| [`public\index.html`](file:///C:/Users/user/.gemini/antigravity/scratch/lumina-discovery/public/index.html) | Complete frontend page with YOUR NEEDS branding, hero, guides, filters |
| [`public\styles.css`](file:///C:/Users/user/.gemini/antigravity/scratch/lumina-discovery/public/styles.css) | 2026 CSS styles, Amazon/Myntra/Flipkart button color schemes, 3D tilt |
| [`public\app.js`](file:///C:/Users/user/.gemini/antigravity/scratch/lumina-discovery/public/app.js) | Frontend application state, search, multi-store buy logic, admin portal |
| [`server.py`](file:///C:/Users/user/.gemini/antigravity/scratch/lumina-discovery/server.py) | Python backend REST API, SQLite database, click telemetry, and static server |
| [`lumina.db`](file:///C:/Users/user/.gemini/antigravity/scratch/lumina-discovery/lumina.db) | SQLite database with products, categories, store links, and click logs |
| [`start_yourneeds.bat`](file:///C:/Users/user/.gemini/antigravity/scratch/lumina-discovery/start_yourneeds.bat) | 1-Click launcher that starts the server and opens `http://localhost:8080` |
| [`reset_password.py`](file:///C:/Users/user/.gemini/antigravity/scratch/lumina-discovery/reset_password.py) | Utility to reset the admin password directly via CLI |

---

## 🚀 How to Launch and Test

1. Open your browser to:
   👉 **[http://localhost:8080](http://localhost:8080)**
2. In the future, double-click **`start_yourneeds.bat`** (or `start_lumina.bat`) to run the platform anytime.

---

## 🛡️ Hidden Owner Dashboard Access

The admin portal is completely invisible to normal visitors:
1. **Secret URL:** Add `?admin` to the URL: [http://localhost:8080/?admin](http://localhost:8080/?admin)
2. **Keyboard Shortcut:** Press `Ctrl` + `Shift` + `A` anywhere on the site.
3. **Secret Logo Click:** Click the **YN** logo in the top-left 3 times quickly.
* **Default Password:** `admin2026`
