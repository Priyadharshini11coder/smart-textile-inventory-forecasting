const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const outDir = path.join(__dirname, 'Project_Report_Screenshots');
const outFile = path.join(outDir, 'System_Flow_Diagram.png');
const htmlFile = path.join(__dirname, 'system_flow_diagram.html');

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 2200" width="1400" height="2200" style="background:#ffffff; font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <!-- Arrow Marker -->
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155" />
    </marker>
    <marker id="arrow-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0D9488" />
    </marker>
    <marker id="arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#D97706" />
    </marker>
    <marker id="arrow-emerald" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
    </marker>

    <!-- Drop Shadows -->
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.08" />
    </filter>
    <filter id="card-shadow" x="-3%" y="-2%" width="106%" height="108%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0F172A" flood-opacity="0.05" />
    </filter>

    <!-- Gradients -->
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#1E293B" />
    </linearGradient>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0D9488" />
      <stop offset="100%" stop-color="#0F766E" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#0369A1" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
  </defs>

  <!-- ================= BACKGROUND & CANVAS ================= -->
  <rect x="0" y="0" width="1400" height="2200" fill="#FFFFFF" />
  
  <!-- Subtle Grid Pattern in Background -->
  <g opacity="0.03">
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000000" stroke-width="1"/>
    </pattern>
    <rect width="1400" height="2200" fill="url(#grid)" />
  </g>

  <!-- ================= REPORT HEADER ================= -->
  <rect x="50" y="35" width="1300" height="115" rx="16" fill="url(#headerGrad)" filter="url(#shadow)" />
  <text x="85" y="77" fill="#14B8A6" font-size="13" font-weight="800" letter-spacing="1.5">FINAL YEAR COLLEGE PROJECT • SYSTEM ARCHITECTURE &amp; WORKFLOW</text>
  <text x="85" y="112" fill="#FFFFFF" font-size="25" font-weight="900" letter-spacing="-0.5">Smart Textile Inventory Management &amp; Demand Forecasting System</text>
  <text x="85" y="134" fill="#94A3B8" font-size="13" font-weight="600">JP Agencies — Operational Workflow Flowchart (Random Forest Machine Learning Engine)</text>

  <!-- ================= PHASE 1: USER INTERACTION & WEB APPLICATION ================= -->
  <rect x="50" y="175" width="1300" height="280" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
  <rect x="75" y="163" width="360" height="26" rx="6" fill="#0F172A" />
  <text x="90" y="180" fill="#F8FAFC" font-size="11" font-weight="800" letter-spacing="1">PHASE 1: USER INTERACTION &amp; DASHBOARD ACCESS</text>

  <!-- Node 1: Start (User / Sales Executive) -->
  <rect x="525" y="210" width="350" height="54" rx="27" fill="url(#tealGrad)" filter="url(#shadow)" />
  <text x="700" y="243" fill="#FFFFFF" font-size="15" font-weight="800" text-anchor="middle">START: Sales Executive / Admin Login</text>

  <!-- Flow Arrow: Start -> Web Dashboard -->
  <line x1="700" y1="264" x2="700" y2="305" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- Node 2: Web Dashboard Access -->
  <rect x="475" y="305" width="450" height="60" rx="12" fill="#FFFFFF" stroke="#0D9488" stroke-width="2" filter="url(#card-shadow)" />
  <text x="700" y="331" fill="#0F172A" font-size="15" font-weight="800" text-anchor="middle">Web Application Dashboard (React.js + Vite)</text>
  <text x="700" y="352" fill="#64748B" font-size="12" font-weight="600" text-anchor="middle">Multi-Brand Overview • Real-Time Stock Status • Navigation Sidebar</text>

  <!-- Branches to 3 Management Modules -->
  <!-- Split bar -->
  <line x1="700" y1="365" x2="700" y2="395" stroke="#334155" stroke-width="2.5" />
  <line x1="240" y1="395" x2="1160" y2="395" stroke="#334155" stroke-width="2.5" />
  
  <line x1="240" y1="395" x2="240" y2="425" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />
  <line x1="700" y1="395" x2="700" y2="425" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />
  <line x1="1160" y1="395" x2="1160" y2="425" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- ================= PHASE 2: MODULE OPERATIONS & TRANSACTION MANAGEMENT ================= -->
  <!-- Node 3A: Textile Product Catalog Management -->
  <rect x="90" y="425" width="300" height="90" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="url(#card-shadow)" />
  <rect x="90" y="425" width="300" height="6" rx="3" fill="#0284C7" />
  <text x="240" y="455" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">Product Catalog Management</text>
  <text x="240" y="475" fill="#0284C7" font-size="11" font-weight="700" text-anchor="middle">RPK • Balaji Garments • Carvel</text>
  <text x="240" y="497" fill="#64748B" font-size="11" text-anchor="middle">SKUs, Garment Sizes, Wholesale Prices, Photos</text>

  <!-- Node 3B: Inventory Management -->
  <rect x="550" y="425" width="300" height="90" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="url(#card-shadow)" />
  <rect x="550" y="425" width="300" height="6" rx="3" fill="#0D9488" />
  <text x="700" y="455" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">Inventory &amp; Stock Tracking</text>
  <text x="700" y="475" fill="#0D9488" font-size="11" font-weight="700" text-anchor="middle">Warehouse Stock Levels</text>
  <text x="700" y="497" fill="#64748B" font-size="11" text-anchor="middle">Manual Stock Adjustments, Batch Inward Logs</text>

  <!-- Node 3C: Sales Recording -->
  <rect x="1010" y="425" width="300" height="90" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="url(#card-shadow)" />
  <rect x="1010" y="425" width="300" height="6" rx="3" fill="#6366F1" />
  <text x="1160" y="455" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">Sales Record Management</text>
  <text x="1160" y="475" fill="#6366F1" font-size="11" font-weight="700" text-anchor="middle">Retail Visits &amp; Bulk Orders</text>
  <text x="1160" y="497" fill="#64748B" font-size="11" text-anchor="middle">Record Shop Sales • Import Historical CSV Data</text>

  <!-- Lines from 3 Modules merging into Database -->
  <line x1="240" y1="515" x2="240" y2="555" stroke="#334155" stroke-width="2.5" />
  <line x1="700" y1="515" x2="700" y2="555" stroke="#334155" stroke-width="2.5" />
  <line x1="1160" y1="515" x2="1160" y2="555" stroke="#334155" stroke-width="2.5" />
  
  <line x1="240" y1="555" x2="1160" y2="555" stroke="#334155" stroke-width="2.5" />
  <line x1="700" y1="555" x2="700" y2="585" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- ================= PHASE 3: DATABASE STORAGE LAYER ================= -->
  <!-- Cylinder Node: Database Storage -->
  <g transform="translate(475, 585)">
    <!-- Cylinder Base -->
    <rect x="0" y="15" width="450" height="65" rx="10" fill="#F1F5F9" stroke="#475569" stroke-width="2" filter="url(#card-shadow)" />
    <!-- Cylinder Top Ellipse -->
    <ellipse cx="225" cy="15" rx="225" ry="14" fill="#334155" stroke="#475569" stroke-width="2" />
    <text x="225" y="19" fill="#FFFFFF" font-size="12" font-weight="800" text-anchor="middle">CENTRAL DATABASE STORAGE LAYER</text>
    <text x="225" y="48" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">MongoDB / Local Persistent JSON Data Store</text>
    <text x="225" y="68" fill="#475569" font-size="11" font-weight="600" text-anchor="middle">Collections: products • sales_records (2,025 txns) • brands • inventory_logs</text>
  </g>

  <!-- Flow Arrow: Database -> Data Preprocessing -->
  <line x1="700" y1="675" x2="700" y2="720" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- ================= PHASE 4: HISTORICAL DATA PREPROCESSING & FEATURE ENGINEERING ================= -->
  <rect x="50" y="720" width="1300" height="345" rx="16" fill="#F0FDFA" stroke="#CCFBF1" stroke-width="1.5" />
  <rect x="75" y="708" width="450" height="26" rx="6" fill="#0F766E" />
  <text x="90" y="725" fill="#FFFFFF" font-size="11" font-weight="800" letter-spacing="1">PHASE 2: ML DATA EXTRACTION &amp; FEATURE ENGINEERING</text>

  <!-- Node 4: Data Cleaning & Preprocessing Process -->
  <rect x="420" y="750" width="560" height="64" rx="10" fill="#FFFFFF" stroke="#0D9488" stroke-width="2" filter="url(#card-shadow)" />
  <text x="700" y="776" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">1. Historical Sales Data Cleaning &amp; Daily Aggregation</text>
  <text x="700" y="798" fill="#64748B" font-size="11" font-weight="600" text-anchor="middle">Parse ISO Sale Dates • Filter Positive Quantities • Reindex Continuous Daily Timeline per SKU</text>

  <!-- Flow Arrow: Cleaning -> Feature Engineering -->
  <line x1="700" y1="814" x2="700" y2="845" stroke="#0D9488" stroke-width="2.5" marker-end="url(#arrow-teal)" />

  <!-- Node 5: Feature Engineering Block (14 Features) -->
  <rect x="180" y="845" width="1040" height="95" rx="10" fill="#FFFFFF" stroke="#0D9488" stroke-width="2" filter="url(#card-shadow)" />
  <text x="700" y="872" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">2. Feature Engineering Pipeline (14 Tabular Numerical Features)</text>
  
  <rect x="205" y="888" width="310" height="40" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
  <text x="360" y="904" fill="#0F172A" font-size="11" font-weight="700" text-anchor="middle">Calendar &amp; Seasonality (5)</text>
  <text x="360" y="920" fill="#64748B" font-size="10" text-anchor="middle">day_of_week, month, day, is_weekend, festival</text>

  <rect x="545" y="888" width="310" height="40" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
  <text x="700" y="904" fill="#0F172A" font-size="11" font-weight="700" text-anchor="middle">Autoregressive Lags (4)</text>
  <text x="700" y="920" fill="#64748B" font-size="10" text-anchor="middle">lag_1 (t-1), lag_7 (t-7), lag_14, lag_30</text>

  <rect x="885" y="888" width="310" height="40" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
  <text x="1040" y="904" fill="#0F172A" font-size="11" font-weight="700" text-anchor="middle">Rolling Statistics (5)</text>
  <text x="1040" y="920" fill="#64748B" font-size="10" text-anchor="middle">rolling_mean_7, 14, 30 • rolling_std_7, 14</text>

  <!-- Flow Arrow: Features -> Train/Test Split -->
  <line x1="700" y1="940" x2="700" y2="970" stroke="#0D9488" stroke-width="2.5" marker-end="url(#arrow-teal)" />

  <!-- Node 6: Chronological 80/20 Train/Test Split -->
  <rect x="400" y="970" width="600" height="64" rx="10" fill="#FFFFFF" stroke="#0D9488" stroke-width="2" filter="url(#card-shadow)" />
  <text x="700" y="996" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">3. Chronological 80% / 20% Train-Test Split (Zero Data Leakage)</text>
  <text x="700" y="1018" fill="#0F766E" font-size="11" font-weight="700" text-anchor="middle">Strict Time-Order: 480 Training Days (Past) • 120 Unseen Holdout Testing Days (Future)</text>

  <!-- Flow Arrow: Phase 2 -> Phase 3 -->
  <line x1="700" y1="1034" x2="700" y2="1080" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- ================= PHASE 5: RANDOM FOREST REGRESSION ENGINE ================= -->
  <rect x="50" y="1080" width="1300" height="275" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
  <rect x="75" y="1068" width="440" height="26" rx="6" fill="#1E293B" />
  <text x="90" y="1085" fill="#FFFFFF" font-size="11" font-weight="800" letter-spacing="1">PHASE 3: RANDOM FOREST MODEL TRAINING &amp; PREDICTION</text>

  <!-- Node 7: Random Forest Model Training -->
  <rect x="420" y="1110" width="560" height="66" rx="10" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" filter="url(#card-shadow)" />
  <text x="700" y="1136" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">Random Forest Regressor Training (Python Scikit-Learn)</text>
  <text x="700" y="1158" fill="#64748B" font-size="11" font-weight="600" text-anchor="middle">Ensemble of 100 Decision Trees • max_depth=6 • min_samples_leaf=2</text>

  <!-- Flow Arrow: Training -> Holdout Evaluation & Prediction -->
  <line x1="700" y1="1176" x2="700" y2="1205" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- Node 8: Model Evaluation & Multi-Step Forecasting -->
  <g transform="translate(250, 1205)">
    <!-- Box A: Model Evaluation -->
    <rect x="0" y="0" width="420" height="75" rx="10" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.5" filter="url(#card-shadow)" />
    <text x="210" y="26" fill="#0F172A" font-size="13" font-weight="800" text-anchor="middle">Holdout Evaluation Metrics</text>
    <text x="210" y="47" fill="#0D9488" font-size="12" font-weight="800" text-anchor="middle">MAE: 4.97 pcs • RMSE: 8.96 pcs • MSE: 80.31</text>
    <text x="210" y="65" fill="#64748B" font-size="10" text-anchor="middle">Evaluated on 120 unseen holdout sales days</text>

    <!-- Box B: Horizon & Multi-Step Prediction -->
    <rect x="480" y="0" width="420" height="75" rx="10" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.5" filter="url(#card-shadow)" />
    <text x="690" y="26" fill="#0F172A" font-size="13" font-weight="800" text-anchor="middle">Multi-Step Autoregressive Prediction</text>
    <text x="690" y="47" fill="#0284C7" font-size="12" font-weight="800" text-anchor="middle">User Selects Horizon: 7 Days or 30 Days</text>
    <text x="690" y="65" fill="#64748B" font-size="10" text-anchor="middle">Iterative lag update forecasting projected daily demand</text>
  </g>

  <!-- Lines merging from Evaluation & Prediction -->
  <line x1="460" y1="1280" x2="460" y2="1310" stroke="#334155" stroke-width="2.5" />
  <line x1="940" y1="1280" x2="940" y2="1310" stroke="#334155" stroke-width="2.5" />
  <line x1="460" y1="1310" x2="940" y2="1310" stroke="#334155" stroke-width="2.5" />
  <line x1="700" y1="1310" x2="700" y2="1355" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- ================= PHASE 6: INVENTORY REPLENISHMENT DECISION LOGIC ================= -->
  <rect x="50" y="1355" width="1300" height="425" rx="16" fill="#FFFBEB" stroke="#FEF3C7" stroke-width="1.5" />
  <rect x="75" y="1343" width="450" height="26" rx="6" fill="#B45309" />
  <text x="90" y="1360" fill="#FFFFFF" font-size="11" font-weight="800" letter-spacing="1">PHASE 4: INVENTORY REPLENISHMENT DECISION LOGIC</text>

  <!-- Node 9: Calculate Target Inventory & Safety Stock -->
  <rect x="400" y="1385" width="600" height="66" rx="10" fill="#FFFFFF" stroke="#D97706" stroke-width="2" filter="url(#card-shadow)" />
  <text x="700" y="1411" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">Calculate Total Demand &amp; Target Inventory Buffer</text>
  <text x="700" y="1433" fill="#B45309" font-size="11" font-weight="700" text-anchor="middle">Target Inventory = Predicted Demand + Safety Buffer (10%–20% based on trend)</text>

  <!-- Flow Arrow: Target Calculation -> Decision Diamond -->
  <line x1="700" y1="1451" x2="700" y2="1490" stroke="#D97706" stroke-width="2.5" marker-end="url(#arrow-amber)" />

  <!-- DECISION DIAMOND (Is Current Stock < Target Inventory?) -->
  <polygon points="700,1490 910,1570 700,1650 490,1570" fill="#FFFFFF" stroke="#D97706" stroke-width="2.5" filter="url(#shadow)" />
  <text x="700" y="1562" fill="#0F172A" font-size="13" font-weight="800" text-anchor="middle">Is Current Stock &lt;</text>
  <text x="700" y="1582" fill="#B45309" font-size="13" font-weight="800" text-anchor="middle">Target Inventory?</text>

  <!-- DECISION BRANCH 1: YES (Reorder Required) -->
  <line x1="490" y1="1570" x2="270" y2="1570" stroke="#D97706" stroke-width="2.5" />
  <line x1="270" y1="1570" x2="270" y2="1670" stroke="#D97706" stroke-width="2.5" marker-end="url(#arrow-amber)" />
  
  <rect x="330" y="1545" width="110" height="22" rx="4" fill="#FEF3C7" stroke="#FDE68A" />
  <text x="385" y="1560" fill="#B45309" font-size="11" font-weight="800" text-anchor="middle">YES (Shortage)</text>

  <!-- Node 10A: Action Required (Reorder) -->
  <rect x="120" y="1670" width="300" height="85" rx="10" fill="#FEF2F2" stroke="#EF4444" stroke-width="2" filter="url(#card-shadow)" />
  <text x="270" y="1698" fill="#991B1B" font-size="14" font-weight="800" text-anchor="middle">Action: Reorder Required</text>
  <text x="270" y="1720" fill="#DC2626" font-size="12" font-weight="700" text-anchor="middle">Order Qty = Target Inv - Current Stock</text>
  <text x="270" y="1740" fill="#7F1D1D" font-size="11" text-anchor="middle">Generate Restock Alert &amp; Supplier Order</text>

  <!-- DECISION BRANCH 2: NO (Stock Optimal) -->
  <line x1="910" y1="1570" x2="1130" y2="1570" stroke="#059669" stroke-width="2.5" />
  <line x1="1130" y1="1570" x2="1130" y2="1670" stroke="#059669" stroke-width="2.5" marker-end="url(#arrow-emerald)" />
  
  <rect x="960" y="1545" width="110" height="22" rx="4" fill="#D1FAE5" stroke="#A7F3D0" />
  <text x="1015" y="1560" fill="#065F46" font-size="11" font-weight="800" text-anchor="middle">NO (Sufficient)</text>

  <!-- Node 10B: Action Optimal (No Reorder) -->
  <rect x="980" y="1670" width="300" height="85" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="2" filter="url(#card-shadow)" />
  <text x="1130" y="1698" fill="#065F46" font-size="14" font-weight="800" text-anchor="middle">Status: Stock is Optimal</text>
  <text x="1130" y="1720" fill="#059669" font-size="12" font-weight="700" text-anchor="middle">No Immediate Purchase Needed</text>
  <text x="1130" y="1740" fill="#047857" font-size="11" text-anchor="middle">Warehouse stock fulfills demand + buffer</text>

  <!-- Lines merging from Decisions to Dashboard Display -->
  <line x1="270" y1="1755" x2="270" y2="1810" stroke="#334155" stroke-width="2.5" />
  <line x1="1130" y1="1755" x2="1130" y2="1810" stroke="#334155" stroke-width="2.5" />
  <line x1="270" y1="1810" x2="1130" y2="1810" stroke="#334155" stroke-width="2.5" />
  <line x1="700" y1="1810" x2="700" y2="1840" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- ================= PHASE 7: DASHBOARD PRESENTATION & REPORTING ================= -->
  <rect x="50" y="1840" width="1300" height="235" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
  <rect x="75" y="1828" width="460" height="26" rx="6" fill="#0F172A" />
  <text x="90" y="1845" fill="#FFFFFF" font-size="11" font-weight="800" letter-spacing="1">PHASE 5: DASHBOARD PRESENTATION &amp; DECISION OUTPUT</text>

  <!-- Node 11: 3-Step Presentation & Catalog Replenishment Matrix -->
  <rect x="180" y="1870" width="1040" height="85" rx="10" fill="#FFFFFF" stroke="#0D9488" stroke-width="2" filter="url(#card-shadow)" />
  <text x="700" y="1898" fill="#0F172A" font-size="14" font-weight="800" text-anchor="middle">Presentation to User on Web Dashboard</text>
  <text x="700" y="1920" fill="#0D9488" font-size="12" font-weight="700" text-anchor="middle">Step 1: Current Stock • Step 2: Predicted Demand • Step 3: Restock Advisory</text>
  <text x="700" y="1940" fill="#64748B" font-size="11" text-anchor="middle">Visual Recharts Sales Curve • 26-SKU Replenishment Guide Table • Excel / CSV Export</text>

  <!-- Flow Arrow: Presentation -> END -->
  <line x1="700" y1="1955" x2="700" y2="1995" stroke="#334155" stroke-width="2.5" marker-end="url(#arrow)" />

  <!-- Node 12: END -->
  <rect x="525" y="1995" width="350" height="54" rx="27" fill="url(#tealGrad)" filter="url(#shadow)" />
  <text x="700" y="2028" fill="#FFFFFF" font-size="15" font-weight="800" text-anchor="middle">END: Continuous Inventory Operations</text>

  <!-- ================= FOOTER / LEGEND ================= -->
  <g transform="translate(180, 2095)">
    <!-- Legend Box -->
    <rect x="0" y="0" width="1040" height="65" rx="10" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" />
    <text x="25" y="25" fill="#0F172A" font-size="12" font-weight="800">FLOWCHART SYMBOL LEGEND:</text>
    
    <!-- Legend Items -->
    <rect x="230" y="12" width="55" height="20" rx="10" fill="#0D9488" />
    <text x="295" y="27" fill="#475569" font-size="11" font-weight="600">Start / End</text>

    <rect x="400" y="12" width="55" height="20" rx="4" fill="#FFFFFF" stroke="#0D9488" stroke-width="1.5" />
    <text x="465" y="27" fill="#475569" font-size="11" font-weight="600">Process Step</text>

    <polygon points="590,12 605,22 590,32 575,22" fill="#FFFFFF" stroke="#D97706" stroke-width="1.5" />
    <text x="618" y="27" fill="#475569" font-size="11" font-weight="600">Decision Condition</text>

    <rect x="765" y="12" width="50" height="20" rx="3" fill="#334155" />
    <text x="825" y="27" fill="#475569" font-size="11" font-weight="600">Database Store</text>

    <text x="25" y="50" fill="#94A3B8" font-size="10">System: JP Agencies Textile Suite • Tech Stack: React.js, Node.js/Express, MongoDB/Store, Python Scikit-Learn</text>
  </g>

</svg>
`;

const htmlPage = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>System Flow Diagram</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

fs.writeFileSync(htmlFile, htmlPage, 'utf8');

async function renderToPNG() {
  console.log('Rendering System Flow Diagram to PNG using Microsoft Edge...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1500,2300', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 2200, deviceScaleFactor: 2 });
  await page.goto('file:///' + htmlFile.replace(/\\\\/g, '/'), { waitUntil: 'networkidle0' });
  
  await page.screenshot({
    path: outFile,
    clip: { x: 0, y: 0, width: 1400, height: 2200 }
  });

  console.log('System Flow Diagram successfully saved to:', outFile);
  await browser.close();
}

renderToPNG().catch(err => {
  console.error('Error generating diagram:', err);
  process.exit(1);
});
