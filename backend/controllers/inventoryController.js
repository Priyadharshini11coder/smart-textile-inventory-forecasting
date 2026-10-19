const store = require('../config/storeAdapter');

exports.getInventory = (req, res) => {
  try {
    const products = store.getProducts();
    const { search, status, brand } = req.query;

    let items = products.map(p => {
      let stockStatus = 'In Stock';
      if (p.currentStock === 0) stockStatus = 'Out of Stock';
      else if (p.currentStock <= p.minStockThreshold) stockStatus = 'Low Stock';
      return {
        id: p.id,
        code: p.code,
        name: p.name,
        brand: p.brand,
        category: p.category,
        size: p.size,
        color: p.color,
        price: p.price,
        currentStock: p.currentStock,
        minStockThreshold: p.minStockThreshold,
        stockStatus
      };
    });

    if (brand && brand !== 'all') {
      items = items.filter(i => i.brand.toLowerCase() === brand.toLowerCase());
    }

    if (status && status !== 'all') {
      items = items.filter(i => i.stockStatus.toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q));
    }

    const summary = {
      totalProducts: products.length,
      totalUnitsInStock: products.reduce((acc, p) => acc + p.currentStock, 0),
      lowStockCount: products.filter(p => p.currentStock > 0 && p.currentStock <= p.minStockThreshold).length,
      outOfStockCount: products.filter(p => p.currentStock === 0).length,
      inStockCount: products.filter(p => p.currentStock > p.minStockThreshold).length
    };

    res.json({ success: true, summary, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.adjustStock = (req, res) => {
  try {
    const { productId, type, quantity, reason, date } = req.body;
    
    // type: 'ADD' (Restock), 'REDUCE' (Damage/Defect/Sample), 'ADJUSTMENT' (Audit set to exact quantity)
    if (!productId || !type || quantity === undefined) {
      return res.status(400).json({ success: false, error: 'Product ID, Adjustment Type, and Quantity are required.' });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be a positive integer.' });
    }

    const products = store.getProducts();
    const product = products.find(p => p.id === productId || p.code === productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const prevStock = product.currentStock;
    let newStock = prevStock;

    if (type === 'ADD') {
      if (qty === 0) return res.status(400).json({ success: false, error: 'Addition quantity must be greater than 0.' });
      newStock = prevStock + qty;
    } else if (type === 'REDUCE') {
      if (qty === 0) return res.status(400).json({ success: false, error: 'Reduction quantity must be greater than 0.' });
      if (qty > prevStock) {
        return res.status(400).json({
          success: false,
          error: `Cannot reduce by ${qty} units. Current stock is only ${prevStock} units.`
        });
      }
      newStock = prevStock - qty;
    } else if (type === 'ADJUSTMENT') {
      newStock = qty;
    } else {
      return res.status(400).json({ success: false, error: 'Invalid adjustment type. Use ADD, REDUCE, or ADJUSTMENT.' });
    }

    product.currentStock = newStock;
    store.saveProducts(products);

    // Record audit transaction
    const transactions = store.getTransactions();
    const txn = {
      id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      brand: product.brand,
      type: type,
      quantityDelta: newStock - prevStock,
      previousStock: prevStock,
      newStock: newStock,
      date: date || new Date().toISOString().split('T')[0],
      reason: reason ? reason.trim() : `Manual stock update (${type})`
    };
    transactions.unshift(txn);
    store.saveTransactions(transactions);

    res.json({
      success: true,
      message: `Stock for ${product.name} successfully updated from ${prevStock} to ${newStock} units.`,
      product: {
        id: product.id,
        code: product.code,
        name: product.name,
        currentStock: newStock
      },
      transaction: txn
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTransactions = (req, res) => {
  try {
    let txns = store.getTransactions();
    const { productCode, type, startDate, endDate } = req.query;

    if (productCode && productCode !== 'all') {
      txns = txns.filter(t => t.productCode === productCode);
    }
    if (type && type !== 'all') {
      txns = txns.filter(t => t.type === type);
    }
    if (startDate) {
      txns = txns.filter(t => t.date >= startDate);
    }
    if (endDate) {
      txns = txns.filter(t => t.date <= endDate);
    }

    res.json({ success: true, count: txns.length, data: txns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
