const fs = require('fs');
const csv = require('csv-parser');
const store = require('../config/storeAdapter');

exports.getSales = (req, res) => {
  try {
    let sales = store.getSales();
    const { startDate, endDate, productCode, brand } = req.query;

    if (startDate) {
      sales = sales.filter(s => s.saleDate >= startDate);
    }
    if (endDate) {
      sales = sales.filter(s => s.saleDate <= endDate);
    }
    if (productCode && productCode !== 'all') {
      sales = sales.filter(s => s.productCode === productCode);
    }
    if (brand && brand !== 'all') {
      sales = sales.filter(s => s.brand.toLowerCase() === brand.toLowerCase());
    }

    // Sort descending by date
    sales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));

    const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || (s.quantitySold * s.sellingPrice) || 0), 0);
    const totalUnits = sales.reduce((sum, s) => sum + (s.quantitySold || 0), 0);

    res.json({
      success: true,
      count: sales.length,
      summary: {
        totalRevenue: Math.round(totalRevenue),
        totalUnitsSold: totalUnits,
        averageOrderValue: sales.length ? Math.round(totalRevenue / sales.length) : 0
      },
      data: sales
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.recordManualSale = (req, res) => {
  try {
    const { saleDate, productCode, quantitySold, sellingPrice, retailShop, paymentMode, notes } = req.body;

    if (!productCode || !quantitySold || quantitySold <= 0) {
      return res.status(400).json({ success: false, error: 'Product Code and valid Quantity Sold are required.' });
    }

    const qty = parseInt(quantitySold);
    const products = store.getProducts();
    const product = products.find(p => p.code === productCode || p.id === productCode);

    if (!product) {
      return res.status(404).json({ success: false, error: `Product code '${productCode}' does not exist in catalogue.` });
    }

    // Validate sufficient inventory
    if (product.currentStock < qty) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock! Requested ${qty} units, but available stock for ${product.name} is only ${product.currentStock} units.`
      });
    }

    const price = sellingPrice !== undefined && sellingPrice !== null && sellingPrice !== '' ? parseFloat(sellingPrice) : product.price;
    const total = qty * price;
    const dateStr = saleDate || new Date().toISOString().split('T')[0];

    const newSale = {
      id: 'SAL-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
      saleDate: dateStr,
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      brand: product.brand,
      category: product.category,
      size: product.size,
      color: product.color,
      quantitySold: qty,
      sellingPrice: price,
      totalAmount: total,
      retailShop: retailShop || 'Direct Retail Visit',
      paymentMode: paymentMode || 'Credit/Invoice',
      notes: notes || '',
      recordedAt: new Date().toISOString()
    };

    // Deduct stock
    const prevStock = product.currentStock;
    product.currentStock = prevStock - qty;
    store.saveProducts(products);

    // Add inventory transaction
    const transactions = store.getTransactions();
    transactions.unshift({
      id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      brand: product.brand,
      type: 'SALE',
      quantityDelta: -qty,
      previousStock: prevStock,
      newStock: product.currentStock,
      date: dateStr,
      reason: `Recorded sale to ${newSale.retailShop} (${qty} units)`
    });
    store.saveTransactions(transactions);

    // Save sale record
    const sales = store.getSales();
    sales.unshift(newSale);
    store.saveSales(sales);

    res.status(201).json({
      success: true,
      message: `Sale recorded successfully for ${qty} units of ${product.name}. Stock updated to ${product.currentStock}.`,
      sale: newSale,
      updatedStock: product.currentStock
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.importSalesCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a CSV file.' });
    }

    const filePath = req.file.path;
    const rows = [];
    const errors = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', () => {
        try {
          fs.unlinkSync(filePath); // Clean up temp uploaded file
        } catch (e) {}

        if (rows.length === 0) {
          return res.status(400).json({ success: false, error: 'The uploaded CSV file is empty.' });
        }

        const existingSales = store.getSales();
        const products = store.getProducts();

        let importedCount = 0;
        let skippedDuplicates = 0;
        const validSales = [];

        // Build set of existing sales signatures to prevent duplicates
        const existingSignatures = new Set(
          existingSales.map(s => `${s.saleDate}_${s.productCode}_${s.quantitySold}_${s.retailShop || ''}`)
        );

        rows.forEach((row, idx) => {
          // Flexible column mapping
          const dateVal = row['Sale Date'] || row['sale_date'] || row['Date'] || row['date'];
          const codeVal = row['Product Code'] || row['product_code'] || row['Code'] || row['code'] || row['SKU'];
          const nameVal = row['Product Name'] || row['product_name'] || row['Name'];
          const brandVal = row['Brand'] || row['brand'];
          const qtyVal = row['Quantity Sold'] || row['quantity'] || row['qty'] || row['Units'];
          const priceVal = row['Selling Price'] || row['price'] || row['Price'];
          const shopVal = row['Retail Shop'] || row['Shop'] || row['Customer'] || 'Retail Partner';

          if (!dateVal || !codeVal || !qtyVal) {
            errors.push(`Row ${idx + 1}: Missing mandatory field (Date, Code, or Quantity)`);
            return;
          }

          const parsedQty = parseInt(qtyVal);
          if (isNaN(parsedQty) || parsedQty <= 0) {
            errors.push(`Row ${idx + 1}: Invalid quantity '${qtyVal}'`);
            return;
          }

          const cleanCode = codeVal.trim().toUpperCase();
          const cleanDate = new Date(dateVal).toISOString().split('T')[0];
          if (cleanDate === 'Invalid Date' || !cleanDate) {
            errors.push(`Row ${idx + 1}: Invalid date format '${dateVal}'`);
            return;
          }

          // Check duplicate
          const sig = `${cleanDate}_${cleanCode}_${parsedQty}_${shopVal.trim()}`;
          if (existingSignatures.has(sig)) {
            skippedDuplicates++;
            return;
          }

          // Lookup product info if available
          const matchedProd = products.find(p => p.code.toUpperCase() === cleanCode);
          const unitPrice = parseFloat(priceVal) || (matchedProd ? matchedProd.price : 500);

          const saleRecord = {
            id: 'SAL-IMP-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
            saleDate: cleanDate,
            productId: matchedProd ? matchedProd.id : '',
            productCode: cleanCode,
            productName: nameVal ? nameVal.trim() : (matchedProd ? matchedProd.name : cleanCode),
            brand: brandVal ? brandVal.trim() : (matchedProd ? matchedProd.brand : 'JP Agencies'),
            category: matchedProd ? matchedProd.category : (row['Category'] || 'General'),
            size: matchedProd ? matchedProd.size : (row['Size'] || 'Standard'),
            color: matchedProd ? matchedProd.color : (row['Color'] || 'Standard'),
            quantitySold: parsedQty,
            sellingPrice: unitPrice,
            totalAmount: parsedQty * unitPrice,
            retailShop: shopVal.trim(),
            imported: true,
            importedAt: new Date().toISOString()
          };

          validSales.push(saleRecord);
          existingSignatures.add(sig);
          importedCount++;
        });

        if (validSales.length > 0) {
          const combined = [...validSales, ...existingSales];
          store.saveSales(combined);
        }

        res.json({
          success: true,
          message: `CSV processing complete. Successfully imported ${importedCount} records.`,
          summary: {
            totalRows: rows.length,
            importedCount,
            skippedDuplicates,
            errorCount: errors.length,
            errors: errors.slice(0, 10) // return up to first 10 validation notes
          }
        });
      });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
