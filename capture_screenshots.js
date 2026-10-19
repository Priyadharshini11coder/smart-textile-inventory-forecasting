const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'Project_Report_Screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('Launching Edge browser for automated report screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1440,900',
      '--disable-gpu',
      '--hide-scrollbars'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // Helper to click sidebar nav
  async function navigateTo(tabId) {
    await page.evaluate((id) => {
      // Find button in sidebar matching tab
      const buttons = Array.from(document.querySelectorAll('aside button'));
      const map = {
        dashboard: 'Dashboard',
        brands: 'Brand Management',
        products: 'Product Catalog',
        inventory: 'Inventory Stock',
        sales: 'Sales Records',
        forecast: 'Demand Forecasting',
        reports: 'Reports & Export'
      };
      const targetText = map[id];
      const btn = buttons.find(b => b.innerText.includes(targetText));
      if (btn) btn.click();
    }, tabId);
    await sleep(1500);
  }

  // Load Base Application
  console.log('Loading http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await sleep(2000);

  // ---------------------------------------------------------------------------
  // SECTION A: WEBSITE AND PRODUCT MANAGEMENT
  // ---------------------------------------------------------------------------

  // Screenshot 1: A01_Home_Page.png
  console.log('Capturing Screenshot 1: A01_Home_Page.png');
  await navigateTo('dashboard');
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A01_Home_Page.png') });

  // Screenshot 2: A02_Inventory_Dashboard.png
  console.log('Capturing Screenshot 2: A02_Inventory_Dashboard.png');
  await page.evaluate(() => window.scrollTo(0, 160));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A02_Inventory_Dashboard.png') });

  // Screenshot 3: A03_Brand_Management.png
  console.log('Capturing Screenshot 3: A03_Brand_Management.png');
  await navigateTo('brands');
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A03_Brand_Management.png') });

  // Screenshot 4: A04_Product_Catalog.png
  console.log('Capturing Screenshot 4: A04_Product_Catalog.png');
  await navigateTo('products');
  await page.evaluate(() => window.scrollTo(0, 240));
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A04_Product_Catalog.png') });

  // Screenshot 5: A05_Product_Details.png
  console.log('Capturing Screenshot 5: A05_Product_Details.png');
  // Click on the first product card to open details modal
  await page.evaluate(() => {
    const cardTitle = document.querySelector('h3.cursor-pointer');
    if (cardTitle) cardTitle.click();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A05_Product_Details.png') });
  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.fixed.inset-0 button');
    if (closeBtn) closeBtn.click();
  });
  await sleep(1000);

  // ---------------------------------------------------------------------------
  // SECTION B: INVENTORY MANAGEMENT
  // ---------------------------------------------------------------------------

  // Screenshot 6: A06_Inventory_Management.png
  console.log('Capturing Screenshot 6: A06_Inventory_Management.png');
  await navigateTo('inventory');
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A06_Inventory_Management.png') });

  // Screenshot 7: A07_Stock_Status.png
  console.log('Capturing Screenshot 7: A07_Stock_Status.png');
  // Select Low Stock in Status Filter
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const statusSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'low_stock'));
    if (statusSelect) {
      statusSelect.value = 'low_stock';
      statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A07_Stock_Status.png') });
  // Reset filter to all
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const statusSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'all'));
    if (statusSelect) {
      statusSelect.value = 'all';
      statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await sleep(1000);

  // Screenshot 8: A08_Stock_Update.png
  console.log('Capturing Screenshot 8: A08_Stock_Update.png');
  // Open stock adjustment modal or switch to Audit History
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const auditBtn = buttons.find(b => b.innerText.includes('Audit History'));
    if (auditBtn) auditBtn.click();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A08_Stock_Update.png') });
  // Switch back to stock table
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const stockBtn = buttons.find(b => b.innerText.includes('Current Stock'));
    if (stockBtn) stockBtn.click();
  });
  await sleep(1000);

  // ---------------------------------------------------------------------------
  // SECTION C: DATASET AND DATA PREPROCESSING
  // ---------------------------------------------------------------------------

  // Screenshot 9: A09_Product_Dataset.png
  console.log('Capturing Screenshot 9: A09_Product_Dataset.png');
  await navigateTo('products');
  // Switch to Table Admin View
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tableBtn = buttons.find(b => b.innerText.includes('Table Admin'));
    if (tableBtn) tableBtn.click();
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.screenshot({ path: path.join(outDir, 'A09_Product_Dataset.png') });
  // Switch back to Card Presentation View
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cardBtn = buttons.find(b => b.innerText.includes('Card Presentation'));
    if (cardBtn) cardBtn.click();
  });
  await sleep(1000);

  // Screenshot 10: A10_Historical_Sales_Dataset.png
  console.log('Capturing Screenshot 10: A10_Historical_Sales_Dataset.png');
  await navigateTo('sales');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const histBtn = buttons.find(b => b.innerText.includes('Historical Sales Dataset'));
    if (histBtn) histBtn.click();
    window.scrollTo(0, 220);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A10_Historical_Sales_Dataset.png') });

  // Screenshot 11: A11_Raw_Sales_Data.png
  console.log('Capturing Screenshot 11: A11_Raw_Sales_Data.png');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const rawBtn = buttons.find(b => b.innerText.includes('Raw Sales Dataset'));
    if (rawBtn) rawBtn.click();
    window.scrollTo(0, 220);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A11_Raw_Sales_Data.png') });

  // Screenshot 12: A12_Preprocessed_Sales_Data.png
  console.log('Capturing Screenshot 12: A12_Preprocessed_Sales_Data.png');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const prepBtn = buttons.find(b => b.innerText.includes('Preprocessed Sales Dataset'));
    if (prepBtn) prepBtn.click();
    window.scrollTo(0, 220);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A12_Preprocessed_Sales_Data.png') });

  // Screenshot 13: A13_Feature_Selection.png
  console.log('Capturing Screenshot 13: A13_Feature_Selection.png');
  await navigateTo('forecast');
  await page.evaluate(() => window.scrollTo(0, 680));
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A13_Feature_Selection.png') });

  // ---------------------------------------------------------------------------
  // SECTION D: MACHINE LEARNING MODEL IMPLEMENTATION
  // ---------------------------------------------------------------------------

  // Screenshot 14: A14_ML_Model_Training.png
  console.log('Capturing Screenshot 14: A14_ML_Model_Training.png');
  await page.evaluate(() => window.scrollTo(0, 0));
  // Click "Train Model Now" button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const trainBtn = buttons.find(b => b.innerText.includes('Train Model Now'));
    if (trainBtn) trainBtn.click();
  });
  await sleep(3500); // Wait for training response
  await page.screenshot({ path: path.join(outDir, 'A14_ML_Model_Training.png') });

  // Screenshot 17: A17_Random_Forest_Regression.png
  console.log('Capturing Screenshot 17: A17_Random_Forest_Regression.png');
  // Scroll down to Random Forest evaluation card and output
  await page.evaluate(() => window.scrollTo(0, 680));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A17_Random_Forest_Regression.png') });

  // Screenshot 18: A18_ML_Prediction_Results.png
  console.log('Capturing Screenshot 18: A18_ML_Prediction_Results.png');
  await page.evaluate(() => window.scrollTo(0, 160));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A18_ML_Prediction_Results.png') });

  // Screenshot 19: A19_Historical_vs_Predicted_Demand.png
  console.log('Capturing Screenshot 19: A19_Historical_vs_Predicted_Demand.png');
  await page.evaluate(() => window.scrollTo(0, 350));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A19_Historical_vs_Predicted_Demand.png') });

  // ---------------------------------------------------------------------------
  // SECTION E: MODEL EVALUATION
  // ---------------------------------------------------------------------------

  // Screenshot 20: A20_Model_Evaluation.png
  console.log('Capturing Screenshot 20: A20_Model_Evaluation.png');
  await page.evaluate(() => window.scrollTo(0, 700));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A20_Model_Evaluation.png') });

  // ---------------------------------------------------------------------------
  // SECTION F: SALES ANALYSIS AND FINAL OUTPUT
  // ---------------------------------------------------------------------------

  // Screenshot 22: A22_Sales_Analysis.png
  console.log('Capturing Screenshot 22: A22_Sales_Analysis.png');
  await navigateTo('reports');
  await sleep(1500);
  // Switch to product-wise sales report tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const prodSalesBtn = buttons.find(b => b.innerText.includes('Product-Wise Sales'));
    if (prodSalesBtn) prodSalesBtn.click();
    window.scrollTo(0, 120);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A22_Sales_Analysis.png') });

  // Screenshot 23: A23_Demand_Forecast_Dashboard.png
  console.log('Capturing Screenshot 23: A23_Demand_Forecast_Dashboard.png');
  await navigateTo('forecast');
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A23_Demand_Forecast_Dashboard.png') });

  // Screenshot 24: A24_Stock_Recommendation.png
  console.log('Capturing Screenshot 24: A24_Stock_Recommendation.png');
  await page.evaluate(() => window.scrollTo(0, 1100));
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A24_Stock_Recommendation.png') });

  // Screenshot 25: A25_Final_System_Dashboard.png
  console.log('Capturing Screenshot 25: A25_Final_System_Dashboard.png');
  await navigateTo('dashboard');
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1500);
  await page.screenshot({ path: path.join(outDir, 'A25_Final_System_Dashboard.png') });

  console.log('Automated screenshot capture complete!');
  await browser.close();
}

run().catch((err) => {
  console.error('Error during screenshot capture:', err);
  process.exit(1);
});
