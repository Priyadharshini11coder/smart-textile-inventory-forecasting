const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const prodCtrl = require('../controllers/productController');

// Multer storage for product photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueName = 'prod-' + Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', prodCtrl.getProducts);
router.get('/:id', prodCtrl.getProductById);
router.post('/', prodCtrl.addProduct);
router.put('/:id', prodCtrl.updateProduct);
router.delete('/:id', prodCtrl.deleteProduct);
router.post('/upload-image', upload.single('image'), prodCtrl.uploadProductImage);

module.exports = router;
