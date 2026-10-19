const express = require('express');
const router = express.Router();
const reportCtrl = require('../controllers/reportController');

router.get('/dashboard-stats', reportCtrl.getDashboardStats);
router.get('/summaries', reportCtrl.getReports);
router.get('/export-csv', reportCtrl.exportCSV);

module.exports = router;
