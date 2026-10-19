const store = require('../config/storeAdapter');

exports.getDashboardStats = (req, res) => {
  try {
    const products = store.getProducts();
    const brands = store.getBrands();
    const sales = store.getSales();
    const transactions = store.getTransactions();

    const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
    const lowStockItems = products.filter(p => p.currentStock > 0 && p.currentStock <= p.minStockThreshold);
    const outOfStockItems = products.filter(p => p.currentStock === 0);

    const totalSalesQuantity = sales.reduce((sum, s) => sum + (s.quantitySold || 0), 0);
    const totalSalesRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || ((s.quantitySold || 0) * (s.sellingPrice || 0))), 0);

    // Best-selling products
    const productSalesMap = {};
    sales.forEach(s => {
      const code = s.productCode;
      if (!productSalesMap[code]) {
        productSalesMap[code] = {
          code: code,
          name: s.productName,
          brand: s.brand,
          unitsSold: 0,
          revenue: 0
        };
      }
      productSalesMap[code].unitsSold += (s.quantitySold || 0);
      productSalesMap[code].revenue += (s.totalAmount || (s.quantitySold * s.sellingPrice) || 0);
    });

    const bestSellers = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Brand sales breakdown
    const brandSalesMap = {};
    sales.forEach(s => {
      const b = s.brand || 'Other';
      if (!brandSalesMap[b]) brandSalesMap[b] = { name: b, units: 0, revenue: 0 };
      brandSalesMap[b].units += (s.quantitySold || 0);
      brandSalesMap[b].revenue += (s.totalAmount || 0);
    });

    // Recent 6 months sales trend
    const monthlyTrendMap = {};
    sales.forEach(s => {
      if (s.saleDate) {
        const ym = s.saleDate.substring(0, 7); // YYYY-MM
        if (!monthlyTrendMap[ym]) monthlyTrendMap[ym] = { month: ym, units: 0, revenue: 0 };
        monthlyTrendMap[ym].units += (s.quantitySold || 0);
        monthlyTrendMap[ym].revenue += (s.totalAmount || 0);
      }
    });

    const monthlyTrend = Object.values(monthlyTrendMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        totalBrands: brands.length,
        totalStock,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        totalSalesQuantity,
        totalSalesRevenue: Math.round(totalSalesRevenue),
        bestSellers,
        brandDistribution: Object.values(brandSalesMap),
        monthlyTrend,
        recentTransactions: transactions.slice(0, 6)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getReports = (req, res) => {
  try {
    const products = store.getProducts();
    const sales = store.getSales();
    const brands = store.getBrands();

    // 1. Inventory Report
    const inventoryReport = products.map(p => ({
      code: p.code,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      stock: p.currentStock,
      threshold: p.minStockThreshold,
      valuation: p.currentStock * p.price,
      status: p.currentStock === 0 ? 'Out of Stock' : (p.currentStock <= p.minStockThreshold ? 'Low Stock' : 'In Stock')
    }));

    // 2. Product-wise sales report
    const prodMap = {};
    sales.forEach(s => {
      const c = s.productCode;
      if (!prodMap[c]) {
        prodMap[c] = { code: c, name: s.productName, brand: s.brand, unitsSold: 0, totalRevenue: 0 };
      }
      prodMap[c].unitsSold += s.quantitySold;
      prodMap[c].totalRevenue += s.totalAmount || (s.quantitySold * s.sellingPrice);
    });
    const productSalesReport = Object.values(prodMap).sort((a, b) => b.unitsSold - a.unitsSold);

    // 3. Brand-wise sales report
    const brdMap = {};
    sales.forEach(s => {
      const b = s.brand || 'Other';
      if (!brdMap[b]) brdMap[b] = { brand: b, unitsSold: 0, totalRevenue: 0 };
      brdMap[b].unitsSold += s.quantitySold;
      brdMap[b].totalRevenue += s.totalAmount || (s.quantitySold * s.sellingPrice);
    });
    const brandSalesReport = Object.values(brdMap);

    res.json({
      success: true,
      data: {
        inventoryReport,
        productSalesReport,
        brandSalesReport
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.exportCSV = (req, res) => {
  try {
    const { reportType } = req.query; // 'inventory', 'sales', 'products'
    let filename = 'jp_agencies_report.csv';
    let csvContent = '';

    if (reportType === 'inventory') {
      filename = 'jp_agencies_inventory_report.csv';
      const products = store.getProducts();
      csvContent = 'Product Code,Product Name,Brand,Category,Size,Color,Price,Current Stock,Min Threshold,Status,Valuation\n';
      products.forEach(p => {
        const status = p.currentStock === 0 ? 'Out of Stock' : (p.currentStock <= p.minStockThreshold ? 'Low Stock' : 'In Stock');
        const val = p.currentStock * p.price;
        csvContent += `"${p.code}","${p.name}","${p.brand}","${p.category}","${p.size}","${p.color}",${p.price},${p.currentStock},${p.minStockThreshold},"${status}",${val}\n`;
      });
    } else {
      filename = 'jp_agencies_sales_report.csv';
      const sales = store.getSales();
      csvContent = 'Sale Date,Product Code,Product Name,Brand,Category,Quantity Sold,Selling Price,Total Amount,Retail Shop\n';
      sales.forEach(s => {
        csvContent += `"${s.saleDate}","${s.productCode}","${s.productName}","${s.brand}","${s.category || ''}",${s.quantitySold},${s.sellingPrice},${s.totalAmount || (s.quantitySold * s.sellingPrice)},"${s.retailShop || ''}"\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
