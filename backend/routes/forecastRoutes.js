const express = require('express');
const router = express.Router();
const forecastCtrl = require('../controllers/forecastController');

router.get('/health', forecastCtrl.getMLHealth);
router.post('/train', forecastCtrl.trainModel);
router.post('/predict', forecastCtrl.getPrediction);
router.get('/metrics', forecastCtrl.getMetrics);
router.get('/recommendations', forecastCtrl.getRecommendations);

module.exports = router;
