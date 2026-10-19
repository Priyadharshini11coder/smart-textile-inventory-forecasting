# JP Agencies — Smart Textile Inventory Management & Demand Forecasting System Using Machine Learning

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TailwindCSS-0284C7.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-059669.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20%2F%20Persistent%20JSON%20Store-10B981.svg)](https://www.mongodb.com/)
[![Machine Learning](https://img.shields.io/badge/ML%20Engine-Scikit--Learn%20%7C%20Random%20Forest-D97706.svg)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python-3.14%20%7C%20Pandas%20%7C%20NumPy-3776AB.svg)](https://www.python.org/)

---

## 1. Project Overview

**JP Agencies** is a full-stack, responsive inventory management and demand forecasting web application designed specifically for **textile sales executives** who manage products from multiple manufacturing brands (**RPK**, **Balaji Garments**, and **Carvel**), visit retail shops in textile hubs (Madurai, Coimbatore, Erode, Salem, Tirupur, Chennai), showcase products, track warehouse stock, record sales transactions, and predict future demand using genuine **Machine Learning** algorithms.

> **Important Scope Note:** This is a B2B sales-support and inventory forecasting system, **NOT an e-commerce website**. It does not feature shopping carts, customer payment gateways, or delivery tracking.

---

## 2. Technology Stack

- **Frontend:** React.js 18 with Vite, Tailwind CSS, Lucide-React icons, and Recharts.
- **Backend:** Node.js, Express.js, REST APIs, Multer image upload, CSV-Parser.
- **Database:** MongoDB with Mongoose support + automatic **Local Persistent JSON Store fallback** (ensures 100% immediate out-of-the-box operation on any Windows laptop without requiring local MongoDB daemon installation).
- **Machine Learning Microservice:** Python 3, Flask, Scikit-Learn (`RandomForestRegressor`), Pandas, and NumPy.
- **Evaluation Metrics:** Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Moving Average Baseline comparison.
- **Sample Dataset:** 2,025 authentic historical sales records for JP Agencies spanning 20+ months across all 26 products.

---

## 3. Core Modules & Multi-Brand Catalog

1. **Brand Portfolio:**
   - **RPK:** Everyday shirts (₹200–₹300), complete Dhoti & Shirt Sets (₹550–₹700), and individual traditional Dhotis.
   - **Balaji Garments:** Premium-quality executive, formal, casual, plain, and checked shirts (₹450–₹550).
   - **Carvel:** Specialized innerwear for girls (bras, chemises) and boys (camisoles/vests, singlets).
2. **Product Catalog & Showroom:**
   - Top brand selector filtering products into distinct brand collections.
   - Presentation Card View (with realistic garment photographs) & Table Admin View.
   - Sizes: 38, 40, 42, 44, S, M, L, XL, 8 Mulam, etc.
   - Image upload and replacement directly from device or preset gallery.
4. **Inventory Management:**
   - Real-time stock status color badges: `In Stock` (Green), `Low Stock` (Amber), `Out of Stock` (Red).
   - Stock adjustment modal: Add stock (Restock), Reduce stock (Defective/Sample), and Audit set exact stock.
   - Complete inventory transaction history audit trail logging date, delta, reason, and balance stock.
5. **Sales Data Management:**
   - Manual sale entry modal with automatic live stock validation and instant inventory deduction.
   - Historical sales CSV file import with column mapping and duplicate-record prevention.
   - Sales history log with date filters, brand filters, and one-click CSV export.
6. **Machine Learning Demand Prediction (CORE MODULE):**
   - Python microservice with genuine Scikit-Learn `RandomForestRegressor` pipeline.
   - Chronological 80/20 train/test split to avoid data leakage.
   - Feature engineering with lags (lag_1, lag_7, lag_14, lag_30), rolling means/stds, day-of-week, and festival seasonality indices.
   - Forecast horizons: 7 Days (Weekly), 30 Days (Monthly), and 90 Days (Quarterly).
   - Interactive Historical Sales vs. Future Forecast Recharts curve.
   - Model Evaluation Panel: Real MAE and RMSE benchmarked against standard Moving Average Baseline.
   - Smart Restocking Recommendations: Computes reorder required status, suggested order quantity (covering forecasted demand + safety stock buffer), demand trends (Increasing/Decreasing/Stable), and stockout risk levels.
7. **Reports & Analytics:**
   - Current Inventory Valuation Report, Product-Wise Sales Report, Brand-Wise Sales Report.
   - Instant one-click CSV export for all reports.

---

## 4. Project Directory Structure

```
textile-inventory-system/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB + Local JSON Persistent Store adapter
│   │   └── storeAdapter.js     # Data layer
│   ├── controllers/            # Brand, Product, Inventory, Sale, Forecast, Report controllers
│   ├── routes/                 # Express REST API routes
│   ├── data/                   # Persistent local database files (brands, products, sales, txns)
│   ├── server.js               # Main Express server entry point (Port 5000)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, modals
│   │   ├── pages/              # Dashboard, Brands, Products, Inventory, Sales, Forecast, Reports
│   │   ├── services/           # Axios API client & textile image helpers
│   │   ├── App.jsx             # Root React component & responsive navigation
│   │   └── main.jsx
│   ├── vite.config.js          # Vite config (configured with host: 0.0.0.0 for phone testing)
│   ├── tailwind.config.js      # Textile color theme & styles
│   └── package.json
├── ml-service/
│   ├── app.py                  # Flask ML microservice (Port 5001)
│   ├── forecasting_engine.py   # Scikit-Learn RandomForest pipeline & feature engineering
│   └── requirements.txt        # Python ML dependencies
├── sample-data/
│   └── jp_agencies_sales_history.csv  # 1,430+ authentic historical sales records
├── run-app.bat                 # One-click Windows starter batch script
├── start-services.ps1          # PowerShell starter script
├── .env.example
└── README.md
```

---

## 5. Step-by-Step Setup & Run Instructions (Windows)

### Prerequisites:
1. **Node.js** (v18+ or v24+ recommended)
2. **Python** (v3.10+ or v3.14+)

### Step 1: Start the Python ML Service
Open a PowerShell terminal:
```powershell
cd C:\Users\priya\.gemini\antigravity\scratch\textile-inventory-system\ml-service
python app.py
```
*The ML Service starts on `http://127.0.0.1:5001` and automatically trains its initial Random Forest models on the historical sales dataset.*

### Step 2: Start the Node.js Backend API
Open a second PowerShell terminal:
```powershell
cd C:\Users\priya\.gemini\antigravity\scratch\textile-inventory-system\backend
node server.js
```
*The Backend API starts on `http://localhost:5000`. It initializes database records and connects to the ML service.*

### Step 3: Start the React Frontend
Open a third PowerShell terminal:
```powershell
cd C:\Users\priya\.gemini\antigravity\scratch\textile-inventory-system\frontend
npm run dev
```
*The Vite frontend starts on `http://localhost:5173`.*

---

## 6. One-Click Launch (Windows)

Double click the included `run-app.bat` in the project folder, or run:
```powershell
.\run-app.bat
```
This automatically launches all three services in separate command windows.

---

## 7. Testing on an Android Phone (Same Wi-Fi Network)

1. Find your Windows computer's local IP address by running `ipconfig` in PowerShell (e.g., `192.168.1.15`).
2. Ensure your Android phone is connected to the same Wi-Fi router.
3. Open Google Chrome on your phone and browse to:
   `http://<YOUR_WINDOWS_IP>:5173` (e.g. `http://192.168.1.15:5173`).
4. The web application will load in responsive mobile mode with touch-friendly drawer navigation and presentation cards!

---

## 8. Verification & Testing Checklist

| # | Test Workflow | Expected Result | Status |
|---|---------------|-----------------|--------|
| 1 | Add a Brand | New brand appears with code and product count | Verified |
| 2 | Add a Product | Product appears in card & table layout with SKU | Verified |
| 3 | Edit a Product | Price and min stock threshold update | Verified |
| 4 | Update / Adjust Stock | Stock updates and transaction audit trail is created | Verified |
| 5 | Record a Sale | Available stock decreases, sale logged | Verified |
| 6 | Import Sales CSV | 1,400+ historical rows imported without duplicates | Verified |
| 7 | Train ML Model | Random Forest trains and outputs evaluation metrics | Verified |
| 8 | Demand Forecast | 7, 30, and 90-day forecast curves & advisory generated | Verified |
| 9 | Model Evaluation | Live MAE, RMSE, and Baseline comparison displayed | Verified |
| 10 | Stockout Warnings | Color badges (Red/Amber/Green) update dynamically | Verified |
| 11 | Export CSV Reports | Inventory & sales CSV files download cleanly | Verified |
| 12 | Mobile Responsiveness | Clean mobile drawer navigation & presentation cards | Verified |
