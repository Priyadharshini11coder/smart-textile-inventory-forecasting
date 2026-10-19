from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
from forecasting_engine import forecaster

app = Flask(__name__)
CORS(app)

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "JP Agencies Textile Demand Forecasting ML Engine",
        "model_engine": "Scikit-Learn Multi-Model Engine (RandomForest, LinearRegression, DecisionTree)",
        "best_global_model": forecaster.best_global_model,
        "trained_at": forecaster.trained_at,
        "is_trained": forecaster.trained_at is not None,
        "global_metrics": forecaster.global_metrics,
        "global_comparison": forecaster.global_comparison
    }), 200

@app.route("/train", methods=["POST"])
def train():
    try:
        data = request.get_json(silent=True) or {}
        sales_records = data.get("sales_records")

        # If records not provided directly in request body, attempt loading sample dataset
        if not sales_records or len(sales_records) == 0:
            sample_csv = r"C:\Users\priya\.gemini\antigravity\scratch\textile-inventory-system\sample-data\jp_agencies_sales_history.csv"
            if os.path.exists(sample_csv):
                df = pd.read_csv(sample_csv)
                sales_records = df.to_dict(orient="records")
            else:
                return jsonify({
                    "success": False,
                    "error": "No sales records provided and sample dataset not found."
                }), 400

        res = forecaster.train(sales_records)
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True) or {}
        product_code = data.get("product_code") or data.get("productCode")
        horizon_days = data.get("horizon_days", 30)
        current_stock = data.get("current_stock", 0)
        model_type = data.get("model_type") or data.get("modelType") or data.get("selected_model") or "RandomForest"

        if not product_code:
            return jsonify({"error": True, "message": "Product code is required for demand prediction."}), 400

        result = forecaster.predict_demand(
            product_code=product_code,
            horizon_days=horizon_days,
            current_stock=current_stock,
            model_type=model_type
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500

@app.route("/metrics", methods=["GET"])
def get_metrics():
    return jsonify({
        "global_metrics": forecaster.global_metrics,
        "global_comparison": forecaster.global_comparison,
        "best_global_model": forecaster.best_global_model,
        "product_metrics": forecaster.metrics,
        "trained_at": forecaster.trained_at
    }), 200

@app.route("/recommendations", methods=["POST"])
def get_recommendations():
    try:
        data = request.get_json(silent=True) or {}
        products = data.get("products", [])
        if not products:
            return jsonify({"recommendations": []}), 200

        recs = forecaster.get_all_recommendations(products)
        return jsonify({"recommendations": recs}), 200
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), 500

if __name__ == "__main__":
    # Pre-train on sample dataset automatically at startup if available
    sample_csv = r"C:\Users\priya\.gemini\antigravity\scratch\textile-inventory-system\sample-data\jp_agencies_sales_history.csv"
    if os.path.exists(sample_csv):
        print(f"Loading initial historical dataset from {sample_csv}...")
        try:
            df = pd.read_csv(sample_csv)
            res = forecaster.train(df.to_dict(orient="records"))
            print(f"Initial training completed: {res.get('trained_products')} products trained.")
        except Exception as err:
            print(f"Initial training warning: {err}")

    port = int(os.environ.get("PORT", 5001))
    print(f"Starting Textile ML Forecasting Service on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
