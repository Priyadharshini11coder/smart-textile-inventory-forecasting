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
