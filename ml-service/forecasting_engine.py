import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

class TextileDemandForecaster:
    def __init__(self):
        self.models = {}  # keyed by product_code, contains dict of models
        self.metrics = {} # keyed by product_code, contains metrics for all 3 models
        self.product_data = {} # processed daily series
        self.global_metrics = {
            "RandomForest": {"mae": 0, "mse": 0, "rmse": 0, "mape": 0},
            "LinearRegression": {"mae": 0, "mse": 0, "rmse": 0, "mape": 0},
            "DecisionTree": {"mae": 0, "mse": 0, "rmse": 0, "mape": 0},
            "baseline_mae": 0
        }
        self.global_comparison = []
        self.best_global_model = "RandomForest"
        self.trained_at = None

    def clean_and_prepare_data(self, sales_records):
        """
        Accepts raw records list with keys:
        'saleDate' or 'Sale Date', 'productCode' or 'Product Code', 'quantity' or 'Quantity Sold', etc.
        """
        if not sales_records:
            return pd.DataFrame()

        df = pd.DataFrame(sales_records)
        
        # Standardize column names
        rename_map = {}
        for col in df.columns:
            clean = col.strip().lower().replace(" ", "_")
            if clean in ["sale_date", "saledate", "date"]:
                rename_map[col] = "sale_date"
            elif clean in ["product_code", "productcode", "code", "sku"]:
                rename_map[col] = "product_code"
            elif clean in ["product_name", "productname", "name"]:
                rename_map[col] = "product_name"
            elif clean in ["brand", "brand_name"]:
                rename_map[col] = "brand"
            elif clean in ["quantity_sold", "quantitysold", "quantity", "qty", "units"]:
                rename_map[col] = "quantity"
            elif clean in ["selling_price", "sellingprice", "price", "unit_price"]:
                rename_map[col] = "price"

        df = df.rename(columns=rename_map)

        # Validate mandatory columns
        required = ["sale_date", "product_code", "quantity"]
        for r in required:
            if r not in df.columns:
                raise ValueError(f"Missing mandatory column: {r}")

        # Type conversion and data cleaning
        df["sale_date"] = pd.to_datetime(df["sale_date"], errors="coerce")
        df = df.dropna(subset=["sale_date"])
        df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(0)
        df = df[df["quantity"] > 0]
        df["product_code"] = df["product_code"].astype(str).str.strip()

        return df

    def _create_features(self, series, lag_days=[1, 7, 14, 30], rolling_windows=[7, 14, 30]):
        """
        Creates time, calendar, lag, and rolling statistics features for time-series tabular modeling.
        """
        df = pd.DataFrame({"y": series})
        df["date"] = df.index
        df["day_of_week"] = df["date"].dt.dayofweek
        df["month"] = df["date"].dt.month
        df["day_of_month"] = df["date"].dt.day
        df["is_weekend"] = df["day_of_week"].isin([5, 6]).astype(int)

        # Indian Textile Seasonality Indicator (Festive & Wedding quarters)
        # Deepavali (Oct/Nov), Pongal (Jan), Wedding season (May/June), Aadi (July/Aug)
        df["is_festival_season"] = df["month"].isin([10, 11, 1, 5, 6, 8]).astype(int)

        for lag in lag_days:
            df[f"lag_{lag}"] = df["y"].shift(lag)

        for win in rolling_windows:
            df[f"rolling_mean_{win}"] = df["y"].shift(1).rolling(window=win, min_periods=1).mean()
            df[f"rolling_std_{win}"] = df["y"].shift(1).rolling(window=win, min_periods=1).std().fillna(0)

        return df

    def train(self, sales_records):
        df = self.clean_and_prepare_data(sales_records)
        if df.empty:
            return {"success": False, "message": "No valid historical sales records found."}

        products = df["product_code"].unique()
        trained_count = 0

        # Accumulators for cross-product global averages
        rf_maes, rf_mses, rf_rmses, rf_mapes = [], [], [], []
        lr_maes, lr_mses, lr_rmses, lr_mapes = [], [], [], []
        dt_maes, dt_mses, dt_rmses, dt_mapes = [], [], [], []
        baseline_maes = []

        for p_code in products:
            p_df = df[df["product_code"] == p_code]
            # Aggregate by day
            daily = p_df.groupby("sale_date")["quantity"].sum()
            
            # Reindex to regular daily frequency across the span
            full_idx = pd.date_range(start=daily.index.min(), end=daily.index.max(), freq="D")
            daily = daily.reindex(full_idx, fill_value=0)

            if len(daily) < 14:
                self.models[p_code] = None
                self.product_data[p_code] = daily
                self.metrics[p_code] = {
                    "status": "Insufficient historical data (less than 14 days of recorded activity)"
                }
                continue

            feature_df = self._create_features(daily)
            clean_feat = feature_df.dropna()

            if len(clean_feat) < 10:
                self.models[p_code] = None
                self.product_data[p_code] = daily
                self.metrics[p_code] = {
                    "status": "Insufficient continuous history after feature engineering"
                }
                continue

            # Chronological 80/20 train/test split to avoid data leakage
            split_idx = int(len(clean_feat) * 0.8)
            train_set = clean_feat.iloc[:split_idx]
            test_set = clean_feat.iloc[split_idx:]

            feature_cols = [c for c in clean_feat.columns if c not in ["y", "date"]]
            X_train, y_train = train_set[feature_cols], train_set["y"]
            X_test, y_test = test_set[feature_cols], test_set["y"]

            # Denominator for safe MAPE calculation
            denom = np.where(y_test.values > 0, y_test.values, 1.0)

            # Baseline Moving Average comparison (7-day rolling mean)
            baseline_preds = test_set["rolling_mean_7"].fillna(train_set["y"].mean()).values
            baseline_mae = float(mean_absolute_error(y_test, baseline_preds))
            baseline_maes.append(baseline_mae)

            # -------------------------------------------------------------
            # Model 1: Random Forest Regressor (Ensemble of 100 Trees)
            # -------------------------------------------------------------
            rf = RandomForestRegressor(n_estimators=100, max_depth=6, min_samples_leaf=2, random_state=42)
            rf.fit(X_train, y_train)
            rf_pred = np.clip(rf.predict(X_test), 0, None)

            rf_mae = float(mean_absolute_error(y_test, rf_pred))
            rf_mse = float(mean_squared_error(y_test, rf_pred))
            rf_rmse = float(np.sqrt(rf_mse))
            rf_mape = float(np.mean(np.abs(y_test.values - rf_pred) / denom) * 100)

            rf_maes.append(rf_mae)
            rf_mses.append(rf_mse)
            rf_rmses.append(rf_rmse)
            rf_mapes.append(rf_mape)

            # -------------------------------------------------------------
            # Model 2: Linear Regression (Ordinary Least Squares)
            # -------------------------------------------------------------
            lr = LinearRegression()
            lr.fit(X_train, y_train)
            lr_pred = np.clip(lr.predict(X_test), 0, None)

            lr_mae = float(mean_absolute_error(y_test, lr_pred))
            lr_mse = float(mean_squared_error(y_test, lr_pred))
            lr_rmse = float(np.sqrt(lr_mse))
            lr_mape = float(np.mean(np.abs(y_test.values - lr_pred) / denom) * 100)

            lr_maes.append(lr_mae)
            lr_mses.append(lr_mse)
            lr_rmses.append(lr_rmse)
            lr_mapes.append(lr_mape)

            # -------------------------------------------------------------
            # Model 3: Decision Tree Regressor (Single Tree)
            # -------------------------------------------------------------
            dt = DecisionTreeRegressor(max_depth=5, min_samples_leaf=3, random_state=42)
            dt.fit(X_train, y_train)
            dt_pred = np.clip(dt.predict(X_test), 0, None)

            dt_mae = float(mean_absolute_error(y_test, dt_pred))
            dt_mse = float(mean_squared_error(y_test, dt_pred))
            dt_rmse = float(np.sqrt(dt_mse))
            dt_mape = float(np.mean(np.abs(y_test.values - dt_pred) / denom) * 100)

            dt_maes.append(dt_mae)
            dt_mses.append(dt_mse)
            dt_rmses.append(dt_rmse)
            dt_mapes.append(dt_mape)

            # Determine best model for this specific product based on lowest test MAE
            product_maes = {
                "RandomForest": rf_mae,
                "LinearRegression": lr_mae,
                "DecisionTree": dt_mae
            }
            best_model_key = min(product_maes, key=product_maes.get)
            model_name_map = {
                "RandomForest": "Random Forest Regressor",
                "LinearRegression": "Linear Regression",
                "DecisionTree": "Decision Tree Regressor"
            }

            comparison_list = [
                {
                    "model_key": "RandomForest",
                    "model_name": "Random Forest Regressor",
                    "algorithm": "Ensemble (100 Decision Trees)",
                    "mae": round(rf_mae, 2),
                    "mse": round(rf_mse, 2),
                    "rmse": round(rf_rmse, 2),
                    "mape": round(rf_mape, 1),
                    "is_best": (best_model_key == "RandomForest")
                },
                {
                    "model_key": "LinearRegression",
                    "model_name": "Linear Regression",
                    "algorithm": "Ordinary Least Squares",
                    "mae": round(lr_mae, 2),
                    "mse": round(lr_mse, 2),
                    "rmse": round(lr_rmse, 2),
                    "mape": round(lr_mape, 1),
                    "is_best": (best_model_key == "LinearRegression")
                },
                {
                    "model_key": "DecisionTree",
                    "model_name": "Decision Tree Regressor",
                    "algorithm": "CART Single Tree",
                    "mae": round(dt_mae, 2),
                    "mse": round(dt_mse, 2),
                    "rmse": round(dt_rmse, 2),
                    "mape": round(dt_mape, 1),
                    "is_best": (best_model_key == "DecisionTree")
                }
            ]

            # Save models and product metrics
            self.models[p_code] = {
                "models": {
                    "RandomForest": rf,
                    "LinearRegression": lr,
                    "DecisionTree": dt
                },
                "feature_cols": feature_cols,
                "last_series": daily,
                "metadata": {
                    "brand": p_df["brand"].iloc[0] if "brand" in p_df.columns else "Unknown",
                    "product_name": p_df["product_name"].iloc[0] if "product_name" in p_df.columns else p_code
                }
            }
            self.product_data[p_code] = daily
            self.metrics[p_code] = {
                "RandomForest": {
                    "mae": round(rf_mae, 2),
                    "mse": round(rf_mse, 2),
                    "rmse": round(rf_rmse, 2),
                    "mape": round(rf_mape, 1)
                },
                "LinearRegression": {
                    "mae": round(lr_mae, 2),
                    "mse": round(lr_mse, 2),
                    "rmse": round(lr_rmse, 2),
                    "mape": round(lr_mape, 1)
                },
                "DecisionTree": {
                    "mae": round(dt_mae, 2),
                    "mse": round(dt_mse, 2),
                    "rmse": round(dt_rmse, 2),
                    "mape": round(dt_mape, 1)
                },
                # Default view uses Random Forest metrics for backward compatibility
                "mae": round(rf_mae, 2),
                "mse": round(rf_mse, 2),
                "rmse": round(rf_rmse, 2),
                "mape": round(rf_mape, 1),
                "baseline_mae": round(baseline_mae, 2),
                "test_samples": len(test_set),
                "train_samples": len(train_set),
                "status": "Trained successfully",
                "best_model": model_name_map[best_model_key],
                "best_model_key": best_model_key,
                "comparison": comparison_list
            }

            trained_count += 1

        self.trained_at = datetime.now().isoformat()

        if rf_maes:
            avg_rf_mae = float(np.mean(rf_maes))
            avg_lr_mae = float(np.mean(lr_maes))
            avg_dt_mae = float(np.mean(dt_maes))

            global_maes = {
                "RandomForest": avg_rf_mae,
                "LinearRegression": avg_lr_mae,
                "DecisionTree": avg_dt_mae
            }
            self.best_global_model = min(global_maes, key=global_maes.get)

            self.global_metrics = {
                "RandomForest": {
                    "mae": round(avg_rf_mae, 2),
                    "mse": round(float(np.mean(rf_mses)), 2),
                    "rmse": round(float(np.mean(rf_rmses)), 2),
                    "mape": round(float(np.mean(rf_mapes)), 1)
                },
                "LinearRegression": {
                    "mae": round(avg_lr_mae, 2),
                    "mse": round(float(np.mean(lr_mses)), 2),
                    "rmse": round(float(np.mean(lr_rmses)), 2),
                    "mape": round(float(np.mean(lr_mapes)), 1)
                },
                "DecisionTree": {
                    "mae": round(avg_dt_mae, 2),
                    "mse": round(float(np.mean(dt_mses)), 2),
                    "rmse": round(float(np.mean(dt_rmses)), 2),
                    "mape": round(float(np.mean(dt_mapes)), 1)
                },
                # Default global averages for backward compatibility
                "mae": round(avg_rf_mae, 2),
                "rmse": round(float(np.mean(rf_rmses)), 2),
                "mape": round(float(np.mean(rf_mapes)), 1),
                "baseline_mae": round(float(np.mean(baseline_maes)), 2),
                "best_global_model": self.best_global_model,
                "trained_products_count": trained_count,
                "total_products_count": len(products),
                "trained_at": self.trained_at
            }

            self.global_comparison = [
                {
                    "model_key": "RandomForest",
                    "model_name": "Random Forest Regressor",
                    "algorithm": "Ensemble (100 Decision Trees)",
                    "mae": round(avg_rf_mae, 2),
                    "mse": round(float(np.mean(rf_mses)), 2),
                    "rmse": round(float(np.mean(rf_rmses)), 2),
                    "mape": round(float(np.mean(rf_mapes)), 1),
                    "is_best": (self.best_global_model == "RandomForest")
                },
                {
                    "model_key": "LinearRegression",
                    "model_name": "Linear Regression",
                    "algorithm": "Ordinary Least Squares",
                    "mae": round(avg_lr_mae, 2),
                    "mse": round(float(np.mean(lr_mses)), 2),
                    "rmse": round(float(np.mean(lr_rmses)), 2),
                    "mape": round(float(np.mean(lr_mapes)), 1),
                    "is_best": (self.best_global_model == "LinearRegression")
                },
                {
                    "model_key": "DecisionTree",
                    "model_name": "Decision Tree Regressor",
                    "algorithm": "CART Single Tree",
                    "mae": round(avg_dt_mae, 2),
                    "mse": round(float(np.mean(dt_mses)), 2),
                    "rmse": round(float(np.mean(dt_rmses)), 2),
                    "mape": round(float(np.mean(dt_mapes)), 1),
                    "is_best": (self.best_global_model == "DecisionTree")
                }
            ]

        return {
            "success": True,
            "trained_products": trained_count,
            "total_products": len(products),
            "global_metrics": self.global_metrics,
            "global_comparison": self.global_comparison,
            "best_global_model": self.best_global_model
        }

    def predict_demand(self, product_code, horizon_days=30, current_stock=0, lead_time_days=7, model_type="RandomForest"):
        """
        Generates genuine forecasts for a specific product for 7, 30, or 90 days ahead
        using the selected regression model ('RandomForest', 'LinearRegression', or 'DecisionTree').
        """
        horizon_days = int(horizon_days)
        if horizon_days not in [7, 30, 90]:
            horizon_days = 30

        # Normalize model_type string
        norm_model = "RandomForest"
        if model_type:
            clean_m = model_type.lower().replace(" ", "").replace("_", "")
            if "linear" in clean_m:
                norm_model = "LinearRegression"
            elif "decision" in clean_m or "tree" in clean_m:
                norm_model = "DecisionTree"
            else:
                norm_model = "RandomForest"

        model_name_map = {
            "RandomForest": "Random Forest Regressor",
            "LinearRegression": "Linear Regression",
            "DecisionTree": "Decision Tree Regressor"
        }

        if product_code not in self.models or self.models[product_code] is None:
            hist_series = self.product_data.get(product_code, pd.Series())
            if hist_series.empty or len(hist_series) == 0:
                return {
                    "error": True,
                    "message": f"No historical sales data found for product code: {product_code}. Please import historical sales data first.",
                    "product_code": product_code
                }
            
            avg_daily = float(hist_series.tail(30).mean()) if len(hist_series) > 0 else 1.0
            last_date = hist_series.index.max() if not hist_series.empty else pd.Timestamp.now()
            
            future_dates = [last_date + timedelta(days=i) for i in range(1, horizon_days + 1)]
            forecast_items = [{"date": d.strftime("%Y-%m-%d"), "predicted": round(avg_daily)} for d in future_dates]
            tot_demand = sum(item["predicted"] for item in forecast_items)
            
            return {
                "product_code": product_code,
                "forecast_horizon_days": horizon_days,
                "total_predicted_demand": tot_demand,
                "forecast": forecast_items,
                "selected_model": norm_model,
                "selected_model_name": model_name_map[norm_model],
                "model_status": "Baseline estimate (insufficient historical records for ML)",
                "metrics": self.metrics.get(product_code, {}),
                "model_comparison": [],
                "inventory_recommendation": self._make_recommendation(current_stock, tot_demand, horizon_days, lead_time_days, "Stable")
            }

        model_entry = self.models[product_code]
        selected_estimator = model_entry["models"].get(norm_model) or model_entry["models"]["RandomForest"]
        feature_cols = model_entry["feature_cols"]
        series = model_entry["last_series"].copy()

        # Multi-step autoregressive forecasting
        future_forecasts = []
        cur_series = series.copy()
        last_date = cur_series.index.max()

        for step in range(1, horizon_days + 1):
            next_date = last_date + timedelta(days=step)
            row_dict = {
                "day_of_week": next_date.dayofweek,
                "month": next_date.month,
                "day_of_month": next_date.day,
                "is_weekend": int(next_date.dayofweek in [5, 6]),
                "is_festival_season": int(next_date.month in [10, 11, 1, 5, 6, 8])
            }
            # Lags relative to next_date
            for lag in [1, 7, 14, 30]:
                val = cur_series.iloc[-lag] if len(cur_series) >= lag else cur_series.mean()
                row_dict[f"lag_{lag}"] = val

            for win in [7, 14, 30]:
                win_slice = cur_series.iloc[-win:] if len(cur_series) >= win else cur_series
                row_dict[f"rolling_mean_{win}"] = float(win_slice.mean())
                row_dict[f"rolling_std_{win}"] = float(win_slice.std()) if len(win_slice) > 1 else 0.0

            x_input = pd.DataFrame([row_dict])[feature_cols]
            pred_val = float(selected_estimator.predict(x_input)[0])
            pred_val_clean = max(0, int(round(pred_val)))

            future_forecasts.append({
                "date": next_date.strftime("%Y-%m-%d"),
                "predicted": pred_val_clean
            })

            cur_series[next_date] = pred_val_clean

        # Historical trend (last 45 days)
        hist_tail = series.tail(45)
        historical_trend = [
            {"date": d.strftime("%Y-%m-%d"), "actual": int(qty)}
            for d, qty in hist_tail.items()
        ]

        # Demand trend calculation
        if len(series) >= 60:
            recent_mean = float(series.iloc[-30:].mean())
            prior_mean = float(series.iloc[-60:-30].mean())
            diff = (recent_mean - prior_mean) / max(prior_mean, 1.0)
            if diff > 0.12:
                trend = "Increasing"
            elif diff < -0.12:
                trend = "Decreasing"
            else:
                trend = "Stable"
        else:
            trend = "Stable"

        tot_predicted_demand = sum(item["predicted"] for item in future_forecasts)

        recommendation = self._make_recommendation(
            current_stock=current_stock,
            predicted_demand=tot_predicted_demand,
            horizon_days=horizon_days,
            lead_time_days=lead_time_days,
            trend=trend
        )

        p_metrics = self.metrics.get(product_code, {})
        model_specific_metrics = p_metrics.get(norm_model, {})
        selected_mae = model_specific_metrics.get("mae", p_metrics.get("mae"))
        selected_mse = model_specific_metrics.get("mse", p_metrics.get("mse"))
        selected_rmse = model_specific_metrics.get("rmse", p_metrics.get("rmse"))
        selected_mape = model_specific_metrics.get("mape", p_metrics.get("mape"))

        active_metrics = {
            "mae": selected_mae,
            "mse": selected_mse,
            "rmse": selected_rmse,
            "mape": selected_mape,
            "baseline_mae": p_metrics.get("baseline_mae"),
            "test_samples": p_metrics.get("test_samples"),
            "train_samples": p_metrics.get("train_samples"),
            "status": p_metrics.get("status"),
            "best_model": p_metrics.get("best_model"),
            "best_model_key": p_metrics.get("best_model_key")
        }

        comparison_list = p_metrics.get("comparison", [])

        return {
            "product_code": product_code,
            "product_name": model_entry["metadata"]["product_name"],
            "brand": model_entry["metadata"]["brand"],
            "forecast_horizon_days": horizon_days,
            "selected_model": norm_model,
            "selected_model_name": model_name_map[norm_model],
            "total_predicted_demand": tot_predicted_demand,
            "daily_average_predicted": round(tot_predicted_demand / horizon_days, 1),
            "historical_trend": historical_trend,
            "forecast": future_forecasts,
            "metrics": active_metrics,
            "model_comparison": comparison_list,
            "best_model": p_metrics.get("best_model"),
            "best_model_key": p_metrics.get("best_model_key"),
            "global_comparison": self.global_comparison,
            "inventory_recommendation": recommendation,
            "explanation": f"Forecast generated using Scikit-Learn {model_name_map[norm_model]} on chronological daily sales history. Demand trend is {trend.lower()} with projected demand of {tot_predicted_demand} units over next {horizon_days} days."
        }

    def _make_recommendation(self, current_stock, predicted_demand, horizon_days, lead_time_days, trend):
        current_stock = int(current_stock)
        predicted_demand = int(predicted_demand)

        # Safety stock buffer based on horizon & trend
        buffer_multiplier = 0.20 if trend == "Increasing" else (0.10 if trend == "Decreasing" else 0.15)
        safety_stock = int(np.ceil(predicted_demand * buffer_multiplier))
        target_inventory = predicted_demand + safety_stock

        reorder_required = current_stock < target_inventory
        suggested_order_qty = max(0, target_inventory - current_stock) if reorder_required else 0

        if current_stock == 0:
            stock_risk = "CRITICAL_OUT_OF_STOCK"
            risk_label = "Product is currently out of stock. Immediate order placement recommended."
        elif current_stock < (predicted_demand / max(1, (horizon_days / 7))):
            stock_risk = "HIGH_STOCKOUT_RISK"
            risk_label = "Stock is below 1-week projected demand. High risk of stockout."
        elif reorder_required:
            stock_risk = "MODERATE_REORDER_DUE"
            risk_label = "Stock will be insufficient to satisfy total horizon demand with safety buffer."
        else:
            stock_risk = "OPTIMAL_STOCK"
            risk_label = "Current stock is sufficient to fulfill predicted demand comfortably."

        return {
            "current_stock": current_stock,
            "predicted_demand": predicted_demand,
            "safety_stock_buffer": safety_stock,
            "reorder_required": reorder_required,
            "suggested_order_quantity": suggested_order_qty,
            "demand_trend": trend,
            "stock_risk_level": stock_risk,
            "recommendation_summary": risk_label,
            "disclaimer": "These inventory planning recommendations are advisory estimates computed from statistical and machine learning forecasts. They do not constitute automated purchase commitments."
        }

    def get_all_recommendations(self, products_list):
        """
        Batch recommendation for all inventory items using default Random Forest model
        """
        results = []
        for p in products_list:
            code = p.get("product_code") or p.get("code") or p.get("sku")
            stock = p.get("current_stock") or p.get("stock") or 0
            
            pred = self.predict_demand(code, horizon_days=30, current_stock=stock, model_type="RandomForest")
            if "error" not in pred:
                rec = pred.get("inventory_recommendation", {})
                results.append({
                    "product_code": code,
                    "product_name": p.get("name") or pred.get("product_name", code),
                    "brand": p.get("brand") or pred.get("brand", "Unknown"),
                    "current_stock": stock,
                    "predicted_demand_30d": pred.get("total_predicted_demand", 0),
                    "reorder_required": rec.get("reorder_required", False),
                    "suggested_order_quantity": rec.get("suggested_order_quantity", 0),
                    "demand_trend": rec.get("demand_trend", "Stable"),
                    "stock_risk_level": rec.get("stock_risk_level", "OPTIMAL_STOCK"),
                    "recommendation_summary": rec.get("recommendation_summary", ""),
                    "mae": pred.get("metrics", {}).get("mae")
                })
            else:
                results.append({
                    "product_code": code,
                    "product_name": p.get("name", code),
                    "brand": p.get("brand", "Unknown"),
                    "current_stock": stock,
                    "predicted_demand_30d": 0,
                    "reorder_required": stock <= 5,
                    "suggested_order_quantity": 20 if stock <= 5 else 0,
                    "demand_trend": "Insufficient Data",
                    "stock_risk_level": "INSUFFICIENT_DATA",
                    "recommendation_summary": "Insufficient sales records for machine learning demand estimation.",
                    "mae": None
                })
        return results

forecaster = TextileDemandForecaster()
