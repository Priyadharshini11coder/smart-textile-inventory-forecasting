const puppeteer = require('puppeteer-core');
const path = require('path');

const outDir = path.join(__dirname, 'Project_Report_Screenshots');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('Recapturing Section D & E ML screenshots with perfect viewport positioning...');
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

  // Navigate to Demand Forecast
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside button'));
    const btn = buttons.find(b => b.innerText.includes('Demand Forecasting'));
    if (btn) btn.click();
  });
  await sleep(2500); // Wait for forecast to fully load

  // A18_ML_Prediction_Results.png - Step 1, 2, 3 business metric cards
  console.log('Recapturing A18_ML_Prediction_Results.png');
  await page.evaluate(() => window.scrollTo(0, 140));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A18_ML_Prediction_Results.png') });

  // A19_Historical_vs_Predicted_Demand.png - Chart fully centered
  console.log('Recapturing A19_Historical_vs_Predicted_Demand.png');
  await page.evaluate(() => window.scrollTo(0, 360));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A19_Historical_vs_Predicted_Demand.png') });

  // A20_Model_Evaluation.png - Scikit-Learn evaluation card fully centered
  console.log('Recapturing A20_Model_Evaluation.png');
  await page.evaluate(() => window.scrollTo(0, 720));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A20_Model_Evaluation.png') });

  // A24_Stock_Recommendation.png - Catalog replenishment table fully centered
  console.log('Recapturing A24_Stock_Recommendation.png');
  await page.evaluate(() => window.scrollTo(0, 1180));
  await sleep(1000);
  await page.screenshot({ path: path.join(outDir, 'A24_Stock_Recommendation.png') });

  console.log('Recapturing complete!');
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
