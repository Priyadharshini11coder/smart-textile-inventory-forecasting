const puppeteer = require('puppeteer-core');
const path = require('path');

const outDir = path.join(__dirname, 'Project_Report_Screenshots');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('Capturing Multi-Model Comparison & Prediction screenshots...');
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

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await sleep(1500);

  // Navigate to Demand Forecasting tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside button'));
    const btn = buttons.find(b => b.innerText.includes('Demand Forecasting'));
    if (btn) btn.click();
  });
  await sleep(2000);

  // Helper to select model from dropdown
  async function selectModel(modelValue) {
    await page.evaluate((val) => {
      const select = document.getElementById('modelSelector');
      if (select) {
        select.value = val;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, modelValue);
    await sleep(2000);
  }

  // 1. A15_Linear_Regression.png - Linear Regression prediction view
  console.log('Capturing A15_Linear_Regression.png...');
  await selectModel('LinearRegression');
  await page.evaluate(() => window.scrollTo(0, 130));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A15_Linear_Regression.png') });
  console.log('Saved A15_Linear_Regression.png');

  // 2. A16_Decision_Tree_Regression.png - Decision Tree prediction view
  console.log('Capturing A16_Decision_Tree_Regression.png...');
  await selectModel('DecisionTree');
  await page.evaluate(() => window.scrollTo(0, 130));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A16_Decision_Tree_Regression.png') });
  console.log('Saved A16_Decision_Tree_Regression.png');

  // 3. A17_Random_Forest_Regression.png - Random Forest prediction view
  console.log('Capturing A17_Random_Forest_Regression.png...');
  await selectModel('RandomForest');
  await page.evaluate(() => window.scrollTo(0, 130));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A17_Random_Forest_Regression.png') });
  console.log('Saved A17_Random_Forest_Regression.png');

  // 4. A20_Model_Evaluation.png - Scikit-Learn evaluation metrics & feature selection
  console.log('Capturing A20_Model_Evaluation.png...');
  await page.evaluate(() => window.scrollTo(0, 700));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A20_Model_Evaluation.png') });
  console.log('Saved A20_Model_Evaluation.png');

  // 5. A21_Model_Comparison.png - Three-Model Performance Comparison Table and Bar Chart
  console.log('Capturing A21_Model_Comparison.png...');
  await page.evaluate(() => {
    const el = document.getElementById('modelComparisonSection');
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      window.scrollTo(0, 950);
    }
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(outDir, 'A21_Model_Comparison.png') });
  console.log('Saved A21_Model_Comparison.png');

  console.log('All 5 target screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
