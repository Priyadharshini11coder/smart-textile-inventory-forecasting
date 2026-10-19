const express = require('express');
const router = express.Router();
const brandCtrl = require('../controllers/brandController');

router.get('/', brandCtrl.getBrands);
router.post('/', brandCtrl.addBrand);
router.put('/:id', brandCtrl.updateBrand);
router.delete('/:id', brandCtrl.deleteBrand);

module.exports = router;
