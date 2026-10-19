# PROJECT REVIEW STUDY GUIDE: OVERALL WORKING OF THE SYSTEM

**Project Title:** Smart Textile Inventory Management and Demand Forecasting System Using Machine Learning  
**Target Domain:** Textile & Apparel Wholesale/Retail Supply Chain (JP Agencies)  
**Core Technologies:** Python, Flask, SQLite, Scikit-learn, HTML5, CSS3, JavaScript  

---

## 1. EXECUTIVE SUMMARY (30-SECOND VIVA PITCH)

> *"The Smart Textile Inventory Management and Demand Forecasting System is an intelligent, web-based decision support system designed to solve the twin challenges of stockouts and overstocking in the textile supply chain. Traditional textile retail relies on intuition, which fails during sudden festive spikes (such as Pongal, wedding seasons, and Deepavali). Our system tracks real-time inventory across three core brands—RPK, Balaji Garments, and Carvel—records daily sales transactions, preprocesses historical sales data, and deploys a supervised Random Forest Regressor (alongside comparative models like Linear Regression and Decision Trees) to predict future 30-day product demand. It automatically evaluates whether current stock satisfies projected demand and issues automated reorder recommendations with safety buffers."*

---

## 2. SYSTEM ARCHITECTURE & MODULES

The project is structured into **four primary architectural tiers**:

```
+-------------------------------------------------------------------------+
|                        1. PRESENTATION TIER (UI)                        |
|  - Brand Catalogs (RPK, Balaji, Carvel)     - Inventory Status Monitor  |
|  - Sales Recording Form                     - ML Forecast Dashboard     |
+-------------------------------------------------------------------------+
                                    |  (REST API / HTTP JSON)
                                    v
+-------------------------------------------------------------------------+
|                        2. APPLICATION TIER (Flask)                      |
|  - Product Management Controller           - Transaction Logger         |
|  - Inventory Controller                    - Reorder Decision Engine    |
+-------------------------------------------------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
          v                                                   v
+-----------------------------------+   +---------------------------------+
|     3. DATA PERSISTENCE TIER      |   |   4. MACHINE LEARNING ENGINE    |
|  - SQLite Relational Database     |   |  - Historical Feature Extractor |
|  - Products Table (26 SKUs)       |   |  - Chronological Train/Test     |
|  - Sales Records Table (2,025 txns|   |  - Random Forest Regressor (100)|
|  - Real-time Stock Quantities     |   |  - Comparative Benchmarks       |
|  - Minimum Threshold Levels       |   |  - Metrics: MAE, MSE, RMSE      |
+-----------------------------------+   +---------------------------------+
```

---

## 3. END-TO-END STEP-BY-STEP WORKFLOW

### Step 1: Product & Brand Catalog Management
* The system organizes products under **three authentic textile brands**:
  1. **RPK:** Traditional South Indian dhotis (gold zari, silver zari, temple border, festive combo sets) and everyday casual/formal cotton shirts.
  2. **Balaji Garments:** Premium executive formal and oxford weave shirts.
  3. **Carvel:** Daily innerwear and essentials (slips, comfort bras, ribbed vests, gym singlets).
* Each of the **26 SKUs** has attributes: `Product ID`, `Brand`, `Name`, `Category`, `Size`, `Colour`, `Unit Price`, `Current Stock`, `Minimum Reorder Threshold`, and high-resolution studio catalog imagery.
* Admins can add new textile items, update wholesale selling prices, and inspect live inventory.

### Step 2: Sales Recording & Inventory Updating
* When a sale occurs in the retail or wholesale counter, the storekeeper records the sale via the web interface:
  - Selects `Product ID` / Brand.
  - Enters `Quantity Sold`, `Sales Date`, and `Selling Price`.
* **Atomic Transaction Execution:**
  - The transaction is inserted into the `sales` table.
  - The database automatically deducts the quantity from the `products` table's `current_stock`.
  - If `current_stock` falls below `min_threshold`, the UI highlights the item with an immediate visual alert (**"Low Stock"** or **"Out of Stock"**).

### Step 3: Historical Sales Preprocessing & Feature Engineering
* To train machine learning models, raw transaction records (2,025 historical sales records from Jan 2025 to Sep 2026) are extracted from SQLite into a Pandas DataFrame.
* **Aggregation:** Data is grouped by `(sales_date, product_id)` to form continuous daily time series.
* **Feature Engineering:**
  - **Lag Features:** `sales_lag_1` (sales yesterday), `sales_lag_7` (sales same day last week).
  - **Rolling Averages:** `rolling_avg_7` (7-day moving average smoothing short-term volatility).
  - **Calendar/Temporal Features:** Day of week (0–6), Day of month (1–31), Month (1–12), Quarter (1–4).
  - **Product Metadata:** Unit price and category encoding.
* **Zero-Lookahead Chronological Splitting:**
  - To prevent **data leakage** (future information leaking into past predictions), the dataset is split chronologically: the earlier ~80% of dates form the training set, and the most recent 60 days form the unseen holdout test set.

### Step 4: Machine Learning Model Training & Forecasting
* **Primary Algorithm — Random Forest Regression:**
  - Trains an ensemble of **100 decorrelated Decision Trees** (`n_estimators=100`, `random_state=42`).
  - Utilizes Bootstrap Aggregation (bagging) with random feature subspace sampling at every split.
  - Averages predictions across all 100 trees to eliminate individual tree variance and avoid overfitting.
* **Comparative Algorithm Benchmarking:**
  - For academic rigor, the system concurrently trains and evaluates:
    1. **Linear Regression** (Parametric baseline)
    2. **Decision Tree Regressor** (Single tree without ensemble benefits)
    3. **7-Day Moving Average** (Classical time-series baseline)
* **Performance Evaluation (Strictly Regression Metrics):**
  - Predictions are tested against actual holdout sales:
    - **Random Forest:** $\text{MAE} = 5.04$ pcs, $\text{RMSE} = 8.29$ pcs, $\text{MSE} = 74.59$
    - **Linear Regression:** $\text{MAE} = 4.84$ pcs, $\text{RMSE} = 8.05$ pcs, $\text{MSE} = 70.08$
    - **Decision Tree:** $\text{MAE} = 5.21$ pcs, $\text{RMSE} = 9.48$ pcs, $\text{MSE} = 103.38$
    - **Moving Average:** $\text{MAE} = 4.66$ pcs, $\text{RMSE} = 7.82$ pcs

### Step 5: Stock Sufficiency & Intelligent Reorder Decision Logic
* The core business value of the system lies in its automated decision rule:
  $$\text{Predicted 30-Day Demand} = \sum_{t=1}^{30} \hat{y}_t$$
* **Decision Evaluation:**
  $$\text{Stock Sufficiency Check:} \quad \text{Current Stock} \ge \text{Predicted 30-Day Demand}$$
  - **Scenario A (Stock Sufficient):** Status is marked **"Adequate"** (Green). No purchase order is required.
  - **Scenario B (Stock Deficit):** If $\text{Current Stock} < \text{Predicted Demand}$, the system triggers an **"Action Required / Reorder Recommended"** alert (Red/Amber).
* **Suggested Order Quantity Calculation:**
  $$\text{Recommended Order Qty} = (\text{Predicted 30-Day Demand} - \text{Current Stock}) + \text{Safety Buffer}$$
  *(Safety buffer protects against supply lead-time delays and unexpected festive surges).*

### Step 6: Interactive Dashboard & Visual Reports
* The manager accesses an analytics dashboard presenting:
  - Live stock level gauges per SKU and brand.
  - Demand forecast cards showing predicted next-month unit demand.
  - Reorder advisories with exact quantities to order from weavers/manufacturers.
  - Interactive charts illustrating historical sales trends vs. projected curves.

---

## 4. TOP VIVA & REVIEW QUESTIONS (CHEAT SHEET)

### Q1: Why did you choose Random Forest Regression instead of simple Linear Regression?
> **Answer:** *"While Linear Regression works well for linear baselines, real textile demand is highly non-linear due to seasonal shocks and intermittent purchase behavior. Random Forest is an ensemble of 100 decision trees that captures non-linear relationships, handles interaction between variables (like festival dates and price points), and reduces variance through bagging without suffering from severe overfitting."*

### Q2: Why are you using MAE, MSE, and RMSE instead of Accuracy percentage or ROC-AUC?
> **Answer:** *"Our target variable is continuous—the exact quantity of garment units sold per day—which is a regression problem, not a classification problem. Metrics like Accuracy, Precision, Recall, and ROC-AUC only apply to discrete classes (e.g., Yes/No). For physical inventory, Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE) directly tell the manager the average forecast error in actual garment pieces."*

### Q3: What is data leakage and how did you prevent it?
> **Answer:** *"Data leakage occurs when information from the future test period accidentally enters the training phase (such as using a random shuffle train-test split on time-series data). We prevented data leakage by strictly using a chronological split: the model is trained on past dates and evaluated exclusively on future unseen dates. Furthermore, rolling averages and lag features are computed strictly using backward-looking windows."*

### Q4: How does the system handle festival seasonality in Tamil Nadu?
> **Answer:** *"Our dataset contains 2,025 transactions capturing major annual festive cycles. The feature engineering pipeline extracts calendar attributes (month, quarter, day of week) and historical lag patterns. During seasonal peaks like Pongal (January dhoti surges), wedding periods (May–June combo sets), and Deepavali (October–November annual peak of 3,774 units), the tree splits recognize these seasonal indicators and boost the forecasted demand accordingly."*

### Q5: How does this project benefit a real textile business like JP Agencies?
> **Answer:** *"It eliminates guesswork. By forecasting 30 days in advance, the business avoids two costly extremes: stockouts (lost revenue during peak festival rushes) and overstocking (capital tied up in unsold inventory, warehousing costs, and fabric degradation). It automates the reorder quantity calculation with buffer stock."*

---

## 5. SUMMARY TABLE OF SYSTEM SPECIFICATIONS

| Dimension | Project Specification |
| :--- | :--- |
| **Industry Domain** | Textile Wholesale & Retail Inventory Management |
| **Brands Covered** | RPK, Balaji Garments, Carvel |
| **Total Catalog SKUs** | 26 distinct textile items |
| **Historical Data Size** | 2,025 transaction records (Jan 2025 – Sep 2026) |
| **Database** | SQLite Relational Database (`textile_inventory.db`) |
| **Primary ML Algorithm** | Random Forest Regressor (`n_estimators=100`) |
| **Comparative Models** | Linear Regression, Decision Tree, Moving Average |
| **Forecast Horizon** | 30-Day Forward Unit Demand |
| **Evaluation Metrics** | MAE (5.04 pcs), RMSE (8.29 pcs), MSE (74.59) |
| **Decision Rule** | Automated Reorder Alert if $\text{Current Stock} < \text{Predicted 30-Day Demand}$ |
