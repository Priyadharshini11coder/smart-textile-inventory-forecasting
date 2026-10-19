const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const saleCtrl = require('../controllers/saleController');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

router.get('/', saleCtrl.getSales);
router.post('/', saleCtrl.recordManualSale);
router.post('/import-csv', upload.single('file'), saleCtrl.importSalesCSV);

module.exports = router;
