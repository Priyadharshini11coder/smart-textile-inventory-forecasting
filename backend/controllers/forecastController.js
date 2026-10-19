const axios = require('axios');
const store = require('../config/storeAdapter');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';

exports.getMLHealth = async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
    res.json({ success: true, mlService: response.data });
  } catch (err) {
    res.status(503).json({
      success: false,
      error: 'Python ML Forecasting Service is not responding at ' + ML_SERVICE_URL,
      instructions: 'Ensure app.py is running in ml-service/ directory.'
    });
  }
};

exports.trainModel = async (req, res) => {
  try {
    const sales = store.getSales();
    if (!sales || sales.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No historical sales data in database. Please record sales or import the historical CSV dataset first.'
      });
    }

    const payload = { sales_records: sales };
    const response = await axios.post(`${ML_SERVICE_URL}/train`, payload, { timeout: 45000 });
    res.json({ success: true, result: response.data });
  } catch (err) {
    const errMsg = err.response ? err.response.data : err.message;
    res.status(500).json({ success: false, error: errMsg });
  }
};

exports.getPrediction = async (req, res) => {
  try {
    const { productCode, horizonDays, modelType, selectedModel } = req.body;
    if (!productCode) {
      return res.status(400).json({ success: false, error: 'Product Code is required.' });
    }

    const products = store.getProducts();
    const product = products.find(p => p.code === productCode || p.id === productCode);
    const stock = product ? product.currentStock : 0;

    const payload = {
      product_code: product ? product.code : productCode,
      horizon_days: horizonDays || 30,
      current_stock: stock,
      model_type: modelType || selectedModel || req.body.model_type || 'RandomForest'
    };

    const response = await axios.post(`${ML_SERVICE_URL}/predict`, payload, { timeout: 15000 });
    res.json({ success: true, data: response.data });
  } catch (err) {
    const errMsg = err.response ? err.response.data : err.message;
    res.status(500).json({ success: false, error: errMsg });
  }
};

exports.getMetrics = async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/metrics`, { timeout: 5000 });
    res.json({ success: true, data: response.data });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not fetch ML metrics: ' + err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const products = store.getProducts();
    const payload = {
      products: products.map(p => ({
        product_code: p.code,
        current_stock: p.currentStock,
        name: p.name,
        brand: p.brand
      }))
    };

    const response = await axios.post(`${ML_SERVICE_URL}/recommendations`, payload, { timeout: 15000 });
    res.json({ success: true, data: response.data.recommendations });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not fetch recommendations: ' + err.message });
  }
};
