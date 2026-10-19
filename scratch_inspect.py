import json
import os
import pandas as pd

# Load products
with open('backend/data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Total Products: {len(products)}")
print(f"Sample keys: {list(products[0].keys())}")
print("\n--- ALL PRODUCTS ---")
for idx, p in enumerate(products, 1):
    print(f"{idx}. ID: {p.get('id')} | Code: {p.get('code')} | Brand: {p.get('brand')} | Name: {p.get('name')} | Cat: {p.get('category')} | Size: {p.get('size')} | Color: {p.get('color')} | Price: {p.get('price')} | Stock: {p.get('currentStock')} | Min: {p.get('minStockLevel')} | Max: {p.get('maxStockLevel')}")

# Load sales dataset
csv_path = 'sample-data/jp_agencies_sales_history.csv'
if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    print(f"\n--- SALES DATASET ---")
    print(f"Total Rows: {len(df)}")
    print(f"Columns: {list(df.columns)}")
    print(f"Data types:\n{df.dtypes}")
    print("\nSample records:")
    print(df.head(5).to_string())
    print("\nSummary statistics:")
    print(df.describe().to_string())

# Load sales.json
with open('backend/data/sales.json', 'r', encoding='utf-8') as f:
    sales = json.load(f)
print(f"\nTotal sales records in backend/data/sales.json: {len(sales)}")
print(f"Sample sale: {sales[0]}")
