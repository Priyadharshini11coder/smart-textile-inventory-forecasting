require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static product images directory if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect database
connectDB();

// Register API Routes
app.use('/api/brands', require('./routes/brandRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/forecast', require('./routes/forecastRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health & Root Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'JP Agencies - Smart Textile Inventory Management & Demand Forecasting System',
    timestamp: new Date().toISOString()
  });
});

// Auto-seed initial sales records from sample CSV if sales store is empty
const store = require('./config/storeAdapter');
const fs = require('fs');
const csv = require('csv-parser');

const seedSalesIfEmpty = () => {
  const currentSales = store.getSales();
  if (currentSales.length === 0) {
    const sampleCsvPath = path.join(__dirname, '..', 'sample-data', 'jp_agencies_sales_history.csv');
    if (fs.existsSync(sampleCsvPath)) {
      console.log('[Auto-Seed] Populating initial historical sales data from sample dataset...');
      const records = [];
      fs.createReadStream(sampleCsvPath)
        .pipe(csv())
        .on('data', (row) => {
          const qty = parseInt(row['Quantity Sold'] || row['quantity'] || 1);
          const price = parseFloat(row['Selling Price'] || row['price'] || 500);
          records.push({
            id: 'SAL-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            saleDate: row['Sale Date'] || row['date'],
            productCode: row['Product Code'] || row['code'],
            productName: row['Product Name'] || row['name'],
            brand: row['Brand'] || row['brand'],
            category: row['Category'] || 'General',
            size: row['Size'] || 'Standard',
            color: row['Color'] || 'Standard',
            quantitySold: qty,
            sellingPrice: price,
            totalAmount: qty * price,
            retailShop: row['Retail Shop'] || 'Retail Partner'
          });
        })
        .on('end', () => {
          store.saveSales(records);
          console.log(`[Auto-Seed] Successfully loaded ${records.length} historical sales records.`);
        });
    }
  }
};
seedSalesIfEmpty();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================================`);
  console.log(`  JP Agencies - Textile Inventory & ML Forecasting Backend API  `);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Network access: http://0.0.0.0:${PORT}`);
  console.log(`==================================================================`);
});
