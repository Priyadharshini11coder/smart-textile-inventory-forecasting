# SMART TEXTILE INVENTORY MANAGEMENT AND DEMAND FORECASTING SYSTEM USING MACHINE LEARNING

## FINAL YEAR PROJECT REPORT - MASTER LIST OF TABLES & DATA TABLES

---

# APPENDIX B – LIST OF TABLES

| Table Number | Table Title | Page Number |
| :---: | :--- | :---: |
| **Table 1** | Product Details and Brand Classification |  |
| **Table 2** | Inventory Management and Stock Details |  |
| **Table 3** | Historical Sales Dataset Attributes and Data Dictionary |  |
| **Table 4** | Data Preprocessing and Feature Selection Pipeline |  |
| **Table 5** | Machine Learning Model Performance Evaluation (Random Forest Regression) |  |
| **Table 6** | Actual Sales and Predicted Demand Comparison with Inventory Replenishment Decision |  |



---


# Table 1: Product Details and Brand Classification

| Product ID | Brand Name | Product Name | Category | Size | Colour | Price (INR) |
| :--- | :--- | --- | --- | --- | --- | --- |
| RPK-SHR-01 | RPK | RPK Classic Sky Blue Cotton Shirt | Shirts | 38, 40, 42, 44 | Sky Blue | Rs. 240 |
| RPK-SHR-02 | RPK | RPK Pure White Twill Formal Shirt | Shirts | 38, 40, 42, 44 | White | Rs. 250 |
| RPK-SHR-03 | RPK | RPK Soft Pastel Pink Casual Shirt | Shirts | 38, 40, 42, 44 | Pink | Rs. 260 |
| RPK-SHR-04 | RPK | RPK Earth Brown Daily Wear Shirt | Shirts | 38, 40, 42, 44 | Brown | Rs. 270 |
| RPK-SHR-05 | RPK | RPK Classic Navy-Red Checked Shirt | Shirts | 38, 40, 42, 44 | Checked | Rs. 290 |
| RPK-SET-01 | RPK | RPK Copper Zari Dhoti & Shirt Set | Dhoti and Shirt Set | 38, 40, 42, 44 | Copper | Rs. 580 |
| RPK-SET-02 | RPK | RPK Silver Border Dhoti & Silk Shirt Set | Dhoti and Shirt Set | 38, 40, 42, 44 | Silver | Rs. 620 |
| RPK-SET-03 | RPK | RPK Pink Copper Festive Dhoti & Shirt Set | Dhoti and Shirt Set | 38, 40, 42, 44 | Pink Copper | Rs. 660 |
| RPK-SET-04 | RPK | RPK Gold Copper Traditional Dhoti & Shirt Set | Dhoti and Shirt Set | 38, 40, 42, 44 | Gold Copper | Rs. 690 |
| RPK-DHT-01 | RPK | RPK Traditional Gold Zari Cotton Dhoti (8 Mulam) | Dhoti | 8 Mulam (3.6m) | Cream / Gold Zari | Rs. 320 |
| RPK-DHT-02 | RPK | RPK Pure White Temple Cotton Dhoti (4 Mulam) | Dhoti | 4 Mulam (1.8m) | Pure White | Rs. 240 |
| RPK-DHT-03 | RPK | RPK Silver Zari Wedding Silk-Cotton Dhoti | Dhoti | 8 Mulam (3.6m) | Silver / Off-White | Rs. 360 |
| BG-SHR-01 | Balaji Garments | Balaji Royal Executive Cotton Formal Shirt | Premium Shirts | 38, 40, 42, 44 | Royal Blue | Rs. 480 |
| BG-SHR-02 | Balaji Garments | Balaji Crisp Charcoal Premium Twill Shirt | Premium Shirts | 38, 40, 42, 44 | Charcoal Grey | Rs. 495 |
| BG-SHR-03 | Balaji Garments | Balaji Solid Pastel Blue Premium Shirt | Premium Shirts | 38, 40, 42, 44 | Pastel Blue | Rs. 510 |
| BG-SHR-04 | Balaji Garments | Balaji Pure White Luxury Satin-Finish Shirt | Premium Shirts | 38, 40, 42, 44 | Pure White | Rs. 530 |
| BG-SHR-05 | Balaji Garments | Balaji Micro-Grid Checked Premium Shirt | Premium Shirts | 38, 40, 42, 44 | Checked | Rs. 540 |
| BG-SHR-06 | Balaji Garments | Balaji Oxford Weave Casual Premium Shirt | Premium Shirts | 38, 40, 42, 44 | Olive Green | Rs. 470 |
| CRV-BRA-01 | Carvel | Carvel Girls Daily Comfort Cotton Bra | Girls' Innerwear | 30, 32, 34, 36 | White | Rs. 180 |
| CRV-BRA-02 | Carvel | Carvel Seamless Everyday Support Bra | Girls' Innerwear | 32, 34, 36, 38 | Beige / Skin | Rs. 220 |
| CRV-CHM-01 | Carvel | Carvel Pure Cotton Full Slip Chemise | Girls' Innerwear | S, M, L, XL | White | Rs. 195 |
| CRV-CHM-02 | Carvel | Carvel Spaghetti Strap Cotton Chemise | Girls' Innerwear | S, M, L, XL | Pastel Pink | Rs. 210 |
| CRV-CAM-01 | Carvel | Carvel Boys 100% Combed Cotton Ribbed Camisole / Vest | Boys' Innerwear | 75cm, 80cm, 85cm, 90cm | White | Rs. 130 |
| CRV-CAM-02 | Carvel | Carvel Classic Soft Undershirt Camisole | Boys' Innerwear | 80cm, 85cm, 90cm, 95cm | White | Rs. 145 |
| CRV-SNG-01 | Carvel | Carvel Boys Breathable Athletic Singlet | Boys' Innerwear | S, M, L, XL | Grey Melange | Rs. 160 |
| CRV-SNG-02 | Carvel | Carvel Active Fit Cotton Gym Singlet | Boys' Innerwear | S, M, L, XL | Charcoal | Rs. 175 |



---


# Table 2: Inventory Management and Stock Details

| Product ID | Product Name | Brand | Available Stock Quantity | Stock Status |
| :--- | :--- | --- | --- | --- |
| RPK-SHR-01 | RPK Classic Sky Blue Cotton Shirt | RPK | 45 pcs | Reorder Due |
| RPK-SHR-02 | RPK Pure White Twill Formal Shirt | RPK | 50 pcs | Reorder Due |
| RPK-SHR-03 | RPK Soft Pastel Pink Casual Shirt | RPK | 30 pcs | Reorder Due |
| RPK-SHR-04 | RPK Earth Brown Daily Wear Shirt | RPK | 25 pcs | Low Stock |
| RPK-SHR-05 | RPK Classic Navy-Red Checked Shirt | RPK | 35 pcs | Reorder Due |
| RPK-SET-01 | RPK Copper Zari Dhoti & Shirt Set | RPK | 25 pcs | Low Stock |
| RPK-SET-02 | RPK Silver Border Dhoti & Silk Shirt Set | RPK | 20 pcs | Low Stock |
| RPK-SET-03 | RPK Pink Copper Festive Dhoti & Shirt Set | RPK | 18 pcs | Low Stock |
| RPK-SET-04 | RPK Gold Copper Traditional Dhoti & Shirt Set | RPK | 22 pcs | Low Stock |
| RPK-DHT-01 | RPK Traditional Gold Zari Cotton Dhoti (8 Mulam) | RPK | 50 pcs | Reorder Due |
| RPK-DHT-02 | RPK Pure White Temple Cotton Dhoti (4 Mulam) | RPK | 60 pcs | Reorder Due |
| RPK-DHT-03 | RPK Silver Zari Wedding Silk-Cotton Dhoti | RPK | 30 pcs | Reorder Due |
| BG-SHR-01 | Balaji Royal Executive Cotton Formal Shirt | Balaji Garments | 35 pcs | Reorder Due |
| BG-SHR-02 | Balaji Crisp Charcoal Premium Twill Shirt | Balaji Garments | 28 pcs | Reorder Due |
| BG-SHR-03 | Balaji Solid Pastel Blue Premium Shirt | Balaji Garments | 32 pcs | Reorder Due |
| BG-SHR-04 | Balaji Pure White Luxury Satin-Finish Shirt | Balaji Garments | 40 pcs | Reorder Due |
| BG-SHR-05 | Balaji Micro-Grid Checked Premium Shirt | Balaji Garments | 20 pcs | Low Stock |
| BG-SHR-06 | Balaji Oxford Weave Casual Premium Shirt | Balaji Garments | 25 pcs | Low Stock |
| CRV-BRA-01 | Carvel Girls Daily Comfort Cotton Bra | Carvel | 60 pcs | Reorder Due |
| CRV-BRA-02 | Carvel Seamless Everyday Support Bra | Carvel | 45 pcs | Reorder Due |
| CRV-CHM-01 | Carvel Pure Cotton Full Slip Chemise | Carvel | 50 pcs | Reorder Due |
| CRV-CHM-02 | Carvel Spaghetti Strap Cotton Chemise | Carvel | 35 pcs | Reorder Due |
| CRV-CAM-01 | Carvel Boys 100% Combed Cotton Ribbed Camisole / Vest | Carvel | 80 pcs | Reorder Due |
| CRV-CAM-02 | Carvel Classic Soft Undershirt Camisole | Carvel | 70 pcs | Reorder Due |
| CRV-SNG-01 | Carvel Boys Breathable Athletic Singlet | Carvel | 40 pcs | Reorder Due |
| CRV-SNG-02 | Carvel Active Fit Cotton Gym Singlet | Carvel | 35 pcs | Reorder Due |



---


# Table 3A: Historical Sales Dataset Attributes and Data Dictionary

| Attribute Name | Data Type | Description | Example Value |
| :--- | :--- | --- | --- |
| Sale Date | String (YYYY-MM-DD) | Date of retail transaction occurrence | 2025-01-01 |
| Product Code | String (Categorical) | Unique stock keeping unit identifier | RPK-SHR-01 |
| Product Name | String | Commercial textile product title | RPK Classic Sky Blue Cotton Shirt |
| Brand | String (Categorical) | Manufacturing brand (RPK, Balaji Garments, Carvel) | RPK |
| Category | String (Categorical) | Apparel segment (Shirts, Dhoti Sets, Innerwear) | Shirts |
| Size | String | Garment size specification or roll dimension | 38, 40, 42, 44 |
| Color | String | Color shade or fabric weave pattern | Sky Blue |
| Quantity Sold | Integer | Number of units purchased by the retailer | 22 |
| Selling Price | Integer (INR) | Wholesale billing price per unit | 240 |
| Total Amount | Integer (INR) | Gross transaction value (Quantity x Price) | 5280 |
| Retail Shop | String | Retail customer shop name and city destination | Senthil Garments, Erode |



---


# Table 3B: Historical Sales Representative Sample Records

| Sale Date | Product Code | Product Name | Brand | Category | Size | Color | Quantity Sold | Selling Price | Total Amount | Retail Shop |
| :--- | :--- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-01-01 | RPK-SHR-01 | RPK Classic Sky Blue Cotton Shirt | RPK | Shirts | 38, 40, 42, 44 | Sky Blue | 22 | 240 | 5280 | Senthil Garments, Erode |
| 2025-01-01 | CRV-CAM-02 | Carvel Classic Soft Undershirt Camisole | Carvel | Boys' Innerwear | 80cm, 85cm, 90cm, 95cm | White | 22 | 145 | 3190 | Murugan Silks, Coimbatore |
| 2025-01-01 | CRV-BRA-01 | Carvel Girls Daily Comfort Cotton Bra | Carvel | Girls' Innerwear | 30, 32, 34, 36 | White | 33 | 180 | 5940 | Murugan Silks, Coimbatore |
| 2025-01-02 | BG-SHR-05 | Balaji Micro-Grid Checked Premium Shirt | Balaji Garments | Premium Shirts | 38, 40, 42, 44 | Checked | 9 | 540 | 4860 | Raja Readymades, Trichy |
| 2025-01-02 | RPK-SET-03 | RPK Pink Copper Festive Dhoti & Shirt Set | RPK | Dhoti and Shirt Set | 38, 40, 42, 44 | Pink Copper | 21 | 660 | 13860 | Sri Lakshmi Textiles, Madurai |
| 2025-01-03 | RPK-SET-01 | RPK Copper Zari Dhoti & Shirt Set | RPK | Dhoti and Shirt Set | 38, 40, 42, 44 | Copper | 34 | 580 | 19720 | Annai Textiles, Tirupur |
| 2025-01-03 | RPK-SHR-05 | RPK Classic Navy-Red Checked Shirt | RPK | Shirts | 38, 40, 42, 44 | Checked | 30 | 290 | 8700 | Vasanth & Co Textiles, Chennai |
| 2025-01-03 | RPK-SHR-04 | RPK Earth Brown Daily Wear Shirt | RPK | Shirts | 38, 40, 42, 44 | Brown | 15 | 270 | 4050 | Vasanth & Co Textiles, Chennai |
| 2025-01-03 | RPK-DHT-03 | RPK Silver Zari Wedding Silk-Cotton Dhoti | RPK | Dhoti | 8 Mulam (3.6m) | Silver / Off-White | 34 | 360 | 12240 | Kalyan Silks Partner Store, Vellore |
| 2025-01-04 | BG-SHR-01 | Balaji Royal Executive Cotton Formal Shirt | Balaji Garments | Premium Shirts | 38, 40, 42, 44 | Royal Blue | 16 | 480 | 7680 | Vasanth & Co Textiles, Chennai |



---


# Table 4: Data Preprocessing and Feature Selection Pipeline

| Pipeline Stage | Details / Attributes | Implementation Purpose |
| :--- | :--- | --- |
| Original Attributes | 11 Raw Columns: Sale Date, Product Code, Product Name, Brand, Category, Size, Color, Quantity Sold, Selling Price, Total Amount, Retail Shop | Historical retail transaction records collected from sales executive field visits (2,025 records). |
| Preprocessing: Date Standardization | pd.to_datetime() conversion to standardized ISO timestamps; Chronological sorting | Eliminates irregular date string formats and enforces time-series sequence. |
| Preprocessing: Daily Aggregation & Reindexing | groupby('Sale Date')['Quantity'].sum().reindex(full_date_range, fill_value=0) | Transforms sporadic shop transactions into an unbroken, regular daily demand time-series per SKU. |
| Preprocessing: Data Validation | Filtering records with quantity > 0; Handling missing values and trimming whitespace | Ensures numeric data integrity and removes invalid negative/null entries. |
| Feature: Calendar & Seasonality (5) | day_of_week (0-6), month (1-12), day_of_month (1-31), is_weekend (0/1), is_festival_season (0/1) | Captures weekly retail restock rhythms, monthly cycles, and South Indian festive/wedding quarters (Deepavali, Pongal, Aadi). |
| Feature: Autoregressive Lags (4) | lag_1 (t-1 day), lag_7 (t-7 days), lag_14 (t-14 days), lag_30 (t-30 days) | Encodes short-term memory, prior-week sales, and monthly momentum without lookahead leakage. |
| Feature: Rolling Statistics (5) | rolling_mean_7, rolling_mean_14, rolling_mean_30, rolling_std_7, rolling_std_14 (all shifted by 1) | Captures moving demand averages and sales volatility buffers while preventing contemporaneous leakage. |
| Validation Split Strategy | Chronological 80% Training / 20% Testing Split (Strictly Time-Ordered) | Prevents future sales data from leaking into training models; tests on unseen 120-day horizon. |
| Target Variable | Quantity (y): Next-day daily units sold for each individual textile SKU | Continuous numeric demand target forecasted via multi-step autoregression. |



---


# Table 5: Machine Learning Model Performance Evaluation (Random Forest Regression)

| Product ID | Product Name | Brand | Algorithm | MAE (Units) | RMSE (Units) | MSE | MAPE (%) | Baseline MAE | Train Samples | Test Samples |
| :--- | :--- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RPK-SHR-01 | RPK Classic Sky Blue Cotton Shirt | RPK | Random Forest Regressor (100 Trees) | 4.97 | 8.96 | 80.31 | 233.0% | 5.29 | 480 | 120 |
| RPK-SHR-02 | RPK Pure White Twill Formal Shirt | RPK | Random Forest Regressor (100 Trees) | 5.08 | 7.7 | 59.27 | 354.8% | 3.66 | 469 | 118 |
| RPK-SHR-03 | RPK Soft Pastel Pink Casual Shirt | RPK | Random Forest Regressor (100 Trees) | 4.41 | 7.48 | 55.9 | 238.4% | 4.56 | 479 | 120 |
| RPK-SHR-04 | RPK Earth Brown Daily Wear Shirt | RPK | Random Forest Regressor (100 Trees) | 4.95 | 8.24 | 67.96 | 248.7% | 4.91 | 484 | 121 |
| RPK-SHR-05 | RPK Classic Navy-Red Checked Shirt | RPK | Random Forest Regressor (100 Trees) | 4.14 | 7.1 | 50.4 | 270.2% | 3.47 | 476 | 120 |
| RPK-SET-01 | RPK Copper Zari Dhoti & Shirt Set | RPK | Random Forest Regressor (100 Trees) | 3.3 | 5.47 | 29.89 | 178.2% | 3.44 | 477 | 120 |
| RPK-SET-02 | RPK Silver Border Dhoti & Silk Shirt Set | RPK | Random Forest Regressor (100 Trees) | 2.23 | 3.28 | 10.74 | 163.5% | 1.53 | 464 | 117 |
| RPK-SET-03 | RPK Pink Copper Festive Dhoti & Shirt Set | RPK | Random Forest Regressor (100 Trees) | 2.6 | 4.38 | 19.17 | 158.7% | 2.24 | 483 | 121 |
| RPK-SET-04 | RPK Gold Copper Traditional Dhoti & Shirt Set | RPK | Random Forest Regressor (100 Trees) | 3.82 | 5.93 | 35.12 | 238.5% | 3.01 | 472 | 118 |
| RPK-DHT-01 | RPK Traditional Gold Zari Cotton Dhoti (8 Mulam) | RPK | Random Forest Regressor (100 Trees) | 4.02 | 7.16 | 51.31 | 219.5% | 3.79 | 447 | 112 |
| RPK-DHT-02 | RPK Pure White Temple Cotton Dhoti (4 Mulam) | RPK | Random Forest Regressor (100 Trees) | 4.88 | 7.09 | 50.28 | 316.1% | 3.96 | 459 | 115 |
| RPK-DHT-03 | RPK Silver Zari Wedding Silk-Cotton Dhoti | RPK | Random Forest Regressor (100 Trees) | 4.6 | 7.81 | 61.06 | 249.1% | 4.89 | 482 | 121 |
| BG-SHR-01 | Balaji Royal Executive Cotton Formal Shirt | Balaji Garments | Random Forest Regressor (100 Trees) | 3.97 | 7.38 | 54.42 | 183.3% | 4.39 | 480 | 121 |
| BG-SHR-02 | Balaji Crisp Charcoal Premium Twill Shirt | Balaji Garments | Random Forest Regressor (100 Trees) | 5.51 | 8.38 | 70.18 | 314.8% | 6.02 | 454 | 114 |
| BG-SHR-03 | Balaji Solid Pastel Blue Premium Shirt | Balaji Garments | Random Forest Regressor (100 Trees) | 6.09 | 9.62 | 92.52 | 337.1% | 5.51 | 472 | 119 |
| BG-SHR-04 | Balaji Pure White Luxury Satin-Finish Shirt | Balaji Garments | Random Forest Regressor (100 Trees) | 5.77 | 11.1 | 123.2 | 253.9% | 6.94 | 474 | 119 |
| BG-SHR-05 | Balaji Micro-Grid Checked Premium Shirt | Balaji Garments | Random Forest Regressor (100 Trees) | 4.54 | 6.93 | 48.0 | 337.0% | 2.89 | 474 | 119 |
| BG-SHR-06 | Balaji Oxford Weave Casual Premium Shirt | Balaji Garments | Random Forest Regressor (100 Trees) | 3.83 | 5.87 | 34.49 | 267.2% | 2.43 | 459 | 115 |
| CRV-BRA-01 | Carvel Girls Daily Comfort Cotton Bra | Carvel | Random Forest Regressor (100 Trees) | 6.32 | 10.33 | 106.7 | 298.1% | 6.72 | 476 | 119 |
| CRV-BRA-02 | Carvel Seamless Everyday Support Bra | Carvel | Random Forest Regressor (100 Trees) | 6.03 | 9.28 | 86.19 | 349.9% | 5.19 | 468 | 118 |
| CRV-CHM-01 | Carvel Pure Cotton Full Slip Chemise | Carvel | Random Forest Regressor (100 Trees) | 7.67 | 10.8 | 116.53 | 530.2% | 5.09 | 479 | 120 |
| CRV-CHM-02 | Carvel Spaghetti Strap Cotton Chemise | Carvel | Random Forest Regressor (100 Trees) | 7.13 | 13.22 | 174.68 | 307.6% | 8.22 | 471 | 118 |
| CRV-CAM-01 | Carvel Boys 100% Combed Cotton Ribbed Camisole / Vest | Carvel | Random Forest Regressor (100 Trees) | 8.32 | 14.46 | 208.95 | 492.4% | 6.98 | 479 | 120 |
| CRV-CAM-02 | Carvel Classic Soft Undershirt Camisole | Carvel | Random Forest Regressor (100 Trees) | 6.02 | 9.3 | 86.57 | 351.7% | 5.45 | 477 | 120 |
| CRV-SNG-01 | Carvel Boys Breathable Athletic Singlet | Carvel | Random Forest Regressor (100 Trees) | 5.9 | 9.61 | 92.37 | 318.3% | 5.56 | 480 | 120 |
| CRV-SNG-02 | Carvel Active Fit Cotton Gym Singlet | Carvel | Random Forest Regressor (100 Trees) | 4.89 | 8.56 | 73.26 | 236.5% | 5.04 | 481 | 121 |



---


# Table 6: Actual Sales and Predicted Demand Comparison with Inventory Replenishment Decision

| Product ID | Product Name | Brand | Forecast Horizon | Recent Actual Sales (30 Days) | Predicted Demand (30 Days) | Current Stock Quantity | Replenishment Action |
| :--- | :--- | --- | --- | --- | --- | --- | --- |
| RPK-SHR-01 | RPK Classic Sky Blue Cotton Shirt | RPK | Next 30 Days | 29 pcs | 143 pcs | 45 pcs | Order +127 pcs |
| RPK-SHR-02 | RPK Pure White Twill Formal Shirt | RPK | Next 30 Days | 56 pcs | 146 pcs | 50 pcs | Order +111 pcs |
| RPK-SHR-03 | RPK Soft Pastel Pink Casual Shirt | RPK | Next 30 Days | 46 pcs | 201 pcs | 30 pcs | Order +192 pcs |
| RPK-SHR-04 | RPK Earth Brown Daily Wear Shirt | RPK | Next 30 Days | 42 pcs | 138 pcs | 25 pcs | Order +127 pcs |
| RPK-SHR-05 | RPK Classic Navy-Red Checked Shirt | RPK | Next 30 Days | 34 pcs | 182 pcs | 35 pcs | Order +166 pcs |
| RPK-SET-01 | RPK Copper Zari Dhoti & Shirt Set | RPK | Next 30 Days | 12 pcs | 53 pcs | 25 pcs | Order +34 pcs |
| RPK-SET-02 | RPK Silver Border Dhoti & Silk Shirt Set | RPK | Next 30 Days | 28 pcs | 66 pcs | 20 pcs | Order +53 pcs |
| RPK-SET-03 | RPK Pink Copper Festive Dhoti & Shirt Set | RPK | Next 30 Days | 31 pcs | 52 pcs | 18 pcs | Order +45 pcs |
| RPK-SET-04 | RPK Gold Copper Traditional Dhoti & Shirt Set | RPK | Next 30 Days | 42 pcs | 84 pcs | 22 pcs | Order +79 pcs |
| RPK-DHT-01 | RPK Traditional Gold Zari Cotton Dhoti (8 Mulam) | RPK | Next 30 Days | 25 pcs | 67 pcs | 50 pcs | Order +24 pcs |
| RPK-DHT-02 | RPK Pure White Temple Cotton Dhoti (4 Mulam) | RPK | Next 30 Days | 83 pcs | 69 pcs | 60 pcs | Order +23 pcs |
| RPK-DHT-03 | RPK Silver Zari Wedding Silk-Cotton Dhoti | RPK | Next 30 Days | 50 pcs | 105 pcs | 30 pcs | Order +86 pcs |
| BG-SHR-01 | Balaji Royal Executive Cotton Formal Shirt | Balaji Garments | Next 30 Days | 62 pcs | 67 pcs | 35 pcs | Order +46 pcs |
| BG-SHR-02 | Balaji Crisp Charcoal Premium Twill Shirt | Balaji Garments | Next 30 Days | 49 pcs | 107 pcs | 28 pcs | Order +90 pcs |
| BG-SHR-03 | Balaji Solid Pastel Blue Premium Shirt | Balaji Garments | Next 30 Days | 29 pcs | 98 pcs | 32 pcs | Order +76 pcs |
| BG-SHR-04 | Balaji Pure White Luxury Satin-Finish Shirt | Balaji Garments | Next 30 Days | 110 pcs | 115 pcs | 40 pcs | Order +98 pcs |
| BG-SHR-05 | Balaji Micro-Grid Checked Premium Shirt | Balaji Garments | Next 30 Days | 7 pcs | 133 pcs | 20 pcs | Order +140 pcs |
| BG-SHR-06 | Balaji Oxford Weave Casual Premium Shirt | Balaji Garments | Next 30 Days | 7 pcs | 34 pcs | 25 pcs | Order +16 pcs |
| CRV-BRA-01 | Carvel Girls Daily Comfort Cotton Bra | Carvel | Next 30 Days | 133 pcs | 277 pcs | 60 pcs | Order +273 pcs |
| CRV-BRA-02 | Carvel Seamless Everyday Support Bra | Carvel | Next 30 Days | 101 pcs | 156 pcs | 45 pcs | Order +143 pcs |
| CRV-CHM-01 | Carvel Pure Cotton Full Slip Chemise | Carvel | Next 30 Days | 139 pcs | 425 pcs | 50 pcs | Order +460 pcs |
| CRV-CHM-02 | Carvel Spaghetti Strap Cotton Chemise | Carvel | Next 30 Days | 86 pcs | 152 pcs | 35 pcs | Order +133 pcs |
| CRV-CAM-01 | Carvel Boys 100% Combed Cotton Ribbed Camisole / Vest | Carvel | Next 30 Days | 143 pcs | 185 pcs | 80 pcs | Order +124 pcs |
| CRV-CAM-02 | Carvel Classic Soft Undershirt Camisole | Carvel | Next 30 Days | 37 pcs | 155 pcs | 70 pcs | Order +101 pcs |
| CRV-SNG-01 | Carvel Boys Breathable Athletic Singlet | Carvel | Next 30 Days | 109 pcs | 209 pcs | 40 pcs | Order +201 pcs |
| CRV-SNG-02 | Carvel Active Fit Cotton Gym Singlet | Carvel | Next 30 Days | 92 pcs | 169 pcs | 35 pcs | Order +151 pcs |



---

