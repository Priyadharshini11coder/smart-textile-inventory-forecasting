const store = require('../config/storeAdapter');

exports.getProducts = (req, res) => {
  try {
    let products = store.getProducts();
    const { brand, category, search, stockStatus, sortBy } = req.query;

    if (brand && brand !== 'all') {
      products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (category && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }

    // Attach stock status badge helper
    products = products.map(p => {
      let status = 'In Stock';
      if (p.currentStock === 0) status = 'Out of Stock';
      else if (p.currentStock <= p.minStockThreshold) status = 'Low Stock';
      return { ...p, stockStatus: status };
    });

    if (stockStatus && stockStatus !== 'all') {
      products = products.filter(p => p.stockStatus.toLowerCase() === stockStatus.toLowerCase());
    }

    // Sorting
    if (sortBy === 'price_asc') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') products.sort((a, b) => b.price - a.price);
    else if (sortBy === 'stock_asc') products.sort((a, b) => a.currentStock - b.currentStock);
    else if (sortBy === 'stock_desc') products.sort((a, b) => b.currentStock - a.currentStock);
    else if (sortBy === 'name_asc') products.sort((a, b) => a.name.localeCompare(b.name));

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const products = store.getProducts();
    const product = products.find(p => p.id === id || p.code === id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    let status = 'In Stock';
    if (product.currentStock === 0) status = 'Out of Stock';
    else if (product.currentStock <= product.minStockThreshold) status = 'Low Stock';

    res.json({ success: true, data: { ...product, stockStatus: status } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addProduct = (req, res) => {
  try {
    const { code, name, brand, category, size, color, price, currentStock, minStockThreshold, description, image } = req.body;

    if (!code || !name || !brand || price === undefined || currentStock === undefined) {
      return res.status(400).json({ success: false, error: 'Product Code, Name, Brand, Price, and Initial Stock are required.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const products = store.getProducts();
    if (products.some(p => p.code.toUpperCase() === cleanCode)) {
      return res.status(400).json({ success: false, error: `Product code '${cleanCode}' already exists. Please use a unique SKU.` });
    }

    const newProduct = {
      id: 'PRD-' + Date.now().toString(36).toUpperCase(),
      code: cleanCode,
      name: name.trim(),
      brand: brand.trim(),
      category: category || 'General',
      size: size || 'Standard',
      color: color || 'Multi',
      price: Math.max(0, parseFloat(price) || 0),
      currentStock: Math.max(0, parseInt(currentStock) || 0),
      minStockThreshold: Math.max(0, parseInt(minStockThreshold) || 10),
      description: description || '',
      image: image || '/assets/products/placeholder.jpg',
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    store.saveProducts(products);

    // Record initial inventory transaction
    const transactions = store.getTransactions();
    transactions.unshift({
      id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      productId: newProduct.id,
      productCode: newProduct.code,
      productName: newProduct.name,
      brand: newProduct.brand,
      type: 'INITIAL_STOCK',
      quantity: newProduct.currentStock,
      previousStock: 0,
      newStock: newProduct.currentStock,
      date: new Date().toISOString().split('T')[0],
      reason: 'Product registered into inventory catalogue'
    });
    store.saveTransactions(transactions);

    res.status(201).json({ success: true, message: 'Product added successfully', data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, category, size, color, price, minStockThreshold, description, image } = req.body;

    const products = store.getProducts();
    const index = products.findIndex(p => p.id === id || p.code === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    products[index] = {
      ...products[index],
      name: name ? name.trim() : products[index].name,
      brand: brand ? brand.trim() : products[index].brand,
      category: category || products[index].category,
      size: size || products[index].size,
      color: color || products[index].color,
      price: price !== undefined ? Math.max(0, parseFloat(price)) : products[index].price,
      minStockThreshold: minStockThreshold !== undefined ? Math.max(0, parseInt(minStockThreshold)) : products[index].minStockThreshold,
      description: description !== undefined ? description : products[index].description,
      image: image || products[index].image,
      updatedAt: new Date().toISOString()
    };

    store.saveProducts(products);
    res.json({ success: true, message: 'Product details updated successfully', data: products[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const products = store.getProducts();
    const product = products.find(p => p.id === id || p.code === id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check sales history
    const sales = store.getSales();
    const hasSales = sales.some(s => s.productCode === product.code || s.productId === product.id);

    if (hasSales) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete product '${product.name}' (${product.code}) because historical sales records depend on it. You can set stock to 0 or mark it inactive instead.`
      });
    }

    const filtered = products.filter(p => p.id !== product.id);
    store.saveProducts(filtered);

    res.json({ success: true, message: `Product '${product.name}' removed successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.uploadProductImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Product photograph uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
