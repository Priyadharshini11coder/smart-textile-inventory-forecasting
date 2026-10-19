const express = require('express');
const router = express.Router();
const invCtrl = require('../controllers/inventoryController');

router.get('/', invCtrl.getInventory);
router.post('/adjust', invCtrl.adjustStock);
router.get('/transactions', invCtrl.getTransactions);

module.exports = router;
