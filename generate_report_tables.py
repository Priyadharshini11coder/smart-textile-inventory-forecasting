import os
import json
import urllib.request
import pandas as pd
import numpy as np

# Ensure target directories exist
project_dir = r"C:\Users\priya\.gemini\antigravity\scratch\textile-inventory-system"
tables_dir = os.path.join(project_dir, "Project_Report_Tables")
desktop_dir = r"C:\Users\priya\OneDrive\Desktop\Project_Report_Tables"
os.makedirs(tables_dir, exist_ok=True)
os.makedirs(desktop_dir, exist_ok=True)

# 1. Load Master Data
with open(os.path.join(project_dir, "backend", "data", "products.json"), "r", encoding="utf-8") as f:
    products = json.load(f)

with open(os.path.join(project_dir, "backend", "data", "brands.json"), "r", encoding="utf-8") as f:
    brands = json.load(f)

csv_path = os.path.join(project_dir, "sample-data", "jp_agencies_sales_history.csv")
sales_df = pd.read_csv(csv_path)
sales_df["Sale Date"] = pd.to_datetime(sales_df["Sale Date"])

# 2. Query ML Service for Metrics & Predictions
metrics_url = "http://127.0.0.1:5001/metrics"
res_m = urllib.request.urlopen(metrics_url)
metrics_data = json.loads(res_m.read().decode("utf-8"))
product_metrics = metrics_data.get("product_metrics", {})
global_metrics = metrics_data.get("global_metrics", {})

# Query recommendations with actual currentStock
prod_payload = []
for p in products:
    prod_payload.append({
        "product_code": p["code"],
        "name": p["name"],
        "brand": p["brand"],
        "current_stock": p["currentStock"]
    })

rec_url = "http://127.0.0.1:5001/recommendations"
req = urllib.request.Request(rec_url, data=json.dumps({"products": prod_payload}).encode("utf-8"), headers={"Content-Type": "application/json"})
res_r = urllib.request.urlopen(req)
recs_data = json.loads(res_r.read().decode("utf-8")).get("recommendations", [])
recs_dict = {r["product_code"]: r for r in recs_data}

# Last 30 days actual sales per product
max_date = sales_df["Sale Date"].max()
min_30d = max_date - pd.Timedelta(days=30)
recent_sales = sales_df[sales_df["Sale Date"] > min_30d].groupby("Product Code")["Quantity Sold"].sum().to_dict()

print(f"Loaded {len(products)} products, {len(recs_data)} recommendations, max sales date: {max_date.strftime('%Y-%m-%d')}")

# ==============================================================================
# TABLE 1: Product Details and Brand Classification
# ==============================================================================
t1_rows = []
for p in products:
    t1_rows.append({
        "Product ID": p["code"],
        "Brand Name": p["brand"],
        "Product Name": p["name"],
        "Category": p["category"],
        "Size": p.get("size", "Standard"),
        "Colour": p.get("color", "Standard"),
        "Price (INR)": f"Rs. {p['price']}"
    })
df_t1 = pd.DataFrame(t1_rows)

# ==============================================================================
# TABLE 2: Inventory Management and Stock Details
# ==============================================================================
t2_rows = []
for p in products:
    rec = recs_dict.get(p["code"], {})
    stock = p["currentStock"]
    if stock == 0:
        status = "Out of Stock"
    elif stock <= 25:
        status = "Low Stock"
    elif rec.get("reorder_required"):
        status = "Reorder Due"
    else:
        status = "Optimal Stock"
    
    t2_rows.append({
        "Product ID": p["code"],
        "Product Name": p["name"],
        "Brand": p["brand"],
        "Available Stock Quantity": f"{stock} pcs",
        "Stock Status": status
    })
df_t2 = pd.DataFrame(t2_rows)

# ==============================================================================
# TABLE 3: Historical Sales Dataset Attributes & Sample Records
# ==============================================================================
t3_attr_rows = [
    {"Attribute Name": "Sale Date", "Data Type": "String (YYYY-MM-DD)", "Description": "Date of retail transaction occurrence", "Example Value": "2025-01-01"},
    {"Attribute Name": "Product Code", "Data Type": "String (Categorical)", "Description": "Unique stock keeping unit identifier", "Example Value": "RPK-SHR-01"},
    {"Attribute Name": "Product Name", "Data Type": "String", "Description": "Commercial textile product title", "Example Value": "RPK Classic Sky Blue Cotton Shirt"},
    {"Attribute Name": "Brand", "Data Type": "String (Categorical)", "Description": "Manufacturing brand (RPK, Balaji Garments, Carvel)", "Example Value": "RPK"},
    {"Attribute Name": "Category", "Data Type": "String (Categorical)", "Description": "Apparel segment (Shirts, Dhoti Sets, Innerwear)", "Example Value": "Shirts"},
    {"Attribute Name": "Size", "Data Type": "String", "Description": "Garment size specification or roll dimension", "Example Value": "38, 40, 42, 44"},
    {"Attribute Name": "Color", "Data Type": "String", "Description": "Color shade or fabric weave pattern", "Example Value": "Sky Blue"},
    {"Attribute Name": "Quantity Sold", "Data Type": "Integer", "Description": "Number of units purchased by the retailer", "Example Value": "22"},
    {"Attribute Name": "Selling Price", "Data Type": "Integer (INR)", "Description": "Wholesale billing price per unit", "Example Value": "240"},
    {"Attribute Name": "Total Amount", "Data Type": "Integer (INR)", "Description": "Gross transaction value (Quantity x Price)", "Example Value": "5280"},
    {"Attribute Name": "Retail Shop", "Data Type": "String", "Description": "Retail customer shop name and city destination", "Example Value": "Senthil Garments, Erode"}
]
df_t3_attr = pd.DataFrame(t3_attr_rows)

# Representative sample records from actual dataset
df_t3_sample = sales_df.head(10).copy()
df_t3_sample["Sale Date"] = df_t3_sample["Sale Date"].dt.strftime("%Y-%m-%d")

# ==============================================================================
# TABLE 4: Data Preprocessing and Feature Selection
# ==============================================================================
t4_rows = [
    {
        "Pipeline Stage": "Original Attributes",
        "Details / Attributes": "11 Raw Columns: Sale Date, Product Code, Product Name, Brand, Category, Size, Color, Quantity Sold, Selling Price, Total Amount, Retail Shop",
        "Implementation Purpose": "Historical retail transaction records collected from sales executive field visits (2,025 records)."
    },
    {
        "Pipeline Stage": "Preprocessing: Date Standardization",
        "Details / Attributes": "pd.to_datetime() conversion to standardized ISO timestamps; Chronological sorting",
        "Implementation Purpose": "Eliminates irregular date string formats and enforces time-series sequence."
    },
    {
        "Pipeline Stage": "Preprocessing: Daily Aggregation & Reindexing",
        "Details / Attributes": "groupby('Sale Date')['Quantity'].sum().reindex(full_date_range, fill_value=0)",
        "Implementation Purpose": "Transforms sporadic shop transactions into an unbroken, regular daily demand time-series per SKU."
    },
    {
        "Pipeline Stage": "Preprocessing: Data Validation",
        "Details / Attributes": "Filtering records with quantity > 0; Handling missing values and trimming whitespace",
        "Implementation Purpose": "Ensures numeric data integrity and removes invalid negative/null entries."
    },
    {
        "Pipeline Stage": "Feature: Calendar & Seasonality (5)",
        "Details / Attributes": "day_of_week (0-6), month (1-12), day_of_month (1-31), is_weekend (0/1), is_festival_season (0/1)",
        "Implementation Purpose": "Captures weekly retail restock rhythms, monthly cycles, and South Indian festive/wedding quarters (Deepavali, Pongal, Aadi)."
    },
    {
        "Pipeline Stage": "Feature: Autoregressive Lags (4)",
        "Details / Attributes": "lag_1 (t-1 day), lag_7 (t-7 days), lag_14 (t-14 days), lag_30 (t-30 days)",
        "Implementation Purpose": "Encodes short-term memory, prior-week sales, and monthly momentum without lookahead leakage."
    },
    {
        "Pipeline Stage": "Feature: Rolling Statistics (5)",
        "Details / Attributes": "rolling_mean_7, rolling_mean_14, rolling_mean_30, rolling_std_7, rolling_std_14 (all shifted by 1)",
        "Implementation Purpose": "Captures moving demand averages and sales volatility buffers while preventing contemporaneous leakage."
    },
    {
        "Pipeline Stage": "Validation Split Strategy",
        "Details / Attributes": "Chronological 80% Training / 20% Testing Split (Strictly Time-Ordered)",
        "Implementation Purpose": "Prevents future sales data from leaking into training models; tests on unseen 120-day horizon."
    },
    {
        "Pipeline Stage": "Target Variable",
        "Details / Attributes": "Quantity (y): Next-day daily units sold for each individual textile SKU",
        "Implementation Purpose": "Continuous numeric demand target forecasted via multi-step autoregression."
    }
]
df_t4 = pd.DataFrame(t4_rows)

# ==============================================================================
# TABLE 5: Machine Learning Model Performance Evaluation (Random Forest)
# ==============================================================================
t5_rows = []
for p in products:
    code = p["code"]
    p_met = product_metrics.get(code, {}).get("RandomForest", {})
    gen_met = product_metrics.get(code, {})
    
    mae = p_met.get("mae", gen_met.get("mae", "-"))
    rmse = p_met.get("rmse", gen_met.get("rmse", "-"))
    mse = p_met.get("mse", gen_met.get("mse", "-"))
    mape = p_met.get("mape", gen_met.get("mape", "-"))
    baseline = gen_met.get("baseline_mae", "-")
    test_samples = gen_met.get("test_samples", 120)
    train_samples = gen_met.get("train_samples", 480)

    t5_rows.append({
        "Product ID": code,
        "Product Name": p["name"],
        "Brand": p["brand"],
        "Algorithm": "Random Forest Regressor (100 Trees)",
        "MAE (Units)": mae,
        "RMSE (Units)": rmse,
        "MSE": mse,
        "MAPE (%)": f"{mape}%" if mape != "-" else "-",
        "Baseline MAE": baseline,
        "Train Samples": train_samples,
        "Test Samples": test_samples
    })
df_t5 = pd.DataFrame(t5_rows)

# ==============================================================================
# TABLE 6: Actual Sales and Predicted Demand Comparison
# ==============================================================================
t6_rows = []
for p in products:
    code = p["code"]
    rec = recs_dict.get(code, {})
    stock = p["currentStock"]
    pred_30d = rec.get("predicted_demand_30d", 0)
    actual_30d = recent_sales.get(code, 0)
    reorder = rec.get("reorder_required", False)
    suggested = rec.get("suggested_order_quantity", 0)
    
    if reorder:
        action = f"Order +{suggested} pcs"
    else:
        action = "Stock Optimal"

    t6_rows.append({
        "Product ID": code,
        "Product Name": p["name"],
        "Brand": p["brand"],
        "Forecast Horizon": "Next 30 Days",
        "Recent Actual Sales (30 Days)": f"{actual_30d} pcs",
        "Predicted Demand (30 Days)": f"{pred_30d} pcs",
        "Current Stock Quantity": f"{stock} pcs",
        "Replenishment Action": action
    })
df_t6 = pd.DataFrame(t6_rows)

def df_to_markdown(df):
    headers = [str(c) for c in df.columns]
    lines = ["| " + " | ".join(headers) + " |"]
    lines.append("| " + " | ".join([":---" if i == 0 or i == 1 else "---" for i in range(len(headers))]) + " |")
    for _, row in df.iterrows():
        clean_row = [str(val).replace("\n", " ").replace("|", "/") for val in row]
        lines.append("| " + " | ".join(clean_row) + " |")
    return "\n".join(lines)

# Export all to CSV & Markdown
def export_table(df, name, title):
    # Save CSV
    csv_proj = os.path.join(tables_dir, f"{name}.csv")
    csv_desk = os.path.join(desktop_dir, f"{name}.csv")
    df.to_csv(csv_proj, index=False, encoding="utf-8-sig")
    df.to_csv(csv_desk, index=False, encoding="utf-8-sig")
    
    # Save Markdown
    md_proj = os.path.join(tables_dir, f"{name}.md")
    md_desk = os.path.join(desktop_dir, f"{name}.md")
    md_content = f"# {title}\n\n" + df_to_markdown(df) + "\n"
    with open(md_proj, "w", encoding="utf-8") as f:
        f.write(md_content)
    with open(md_desk, "w", encoding="utf-8") as f:
        f.write(md_content)

export_table(df_t1, "Table_1_Product_Details_and_Brand_Classification", "Table 1: Product Details and Brand Classification")
export_table(df_t2, "Table_2_Inventory_Management_and_Stock_Details", "Table 2: Inventory Management and Stock Details")
export_table(df_t3_attr, "Table_3A_Historical_Sales_Dataset_Attributes", "Table 3A: Historical Sales Dataset Attributes and Data Dictionary")
export_table(df_t3_sample, "Table_3B_Historical_Sales_Sample_Records", "Table 3B: Historical Sales Representative Sample Records")
export_table(df_t4, "Table_4_Data_Preprocessing_and_Feature_Selection", "Table 4: Data Preprocessing and Feature Selection Pipeline")
export_table(df_t5, "Table_5_Machine_Learning_Model_Performance_Evaluation", "Table 5: Machine Learning Model Performance Evaluation (Random Forest Regression)")
export_table(df_t6, "Table_6_Actual_Sales_and_Predicted_Demand_Comparison", "Table 6: Actual Sales and Predicted Demand Comparison with Inventory Replenishment Decision")

# Generate APPENDIX B - LIST OF TABLES
appendix_b_content = """# APPENDIX B – LIST OF TABLES

| Table Number | Table Title | Page Number |
| :---: | :--- | :---: |
| **Table 1** | Product Details and Brand Classification |  |
| **Table 2** | Inventory Management and Stock Details |  |
| **Table 3** | Historical Sales Dataset Attributes and Data Dictionary |  |
| **Table 4** | Data Preprocessing and Feature Selection Pipeline |  |
| **Table 5** | Machine Learning Model Performance Evaluation (Random Forest Regression) |  |
| **Table 6** | Actual Sales and Predicted Demand Comparison with Inventory Replenishment Decision |  |
"""

with open(os.path.join(tables_dir, "APPENDIX_B_LIST_OF_TABLES.md"), "w", encoding="utf-8") as f:
    f.write(appendix_b_content)
with open(os.path.join(desktop_dir, "APPENDIX_B_LIST_OF_TABLES.md"), "w", encoding="utf-8") as f:
    f.write(appendix_b_content)

print("Successfully generated all tables in Markdown and CSV formats in both project and Desktop directories!")
