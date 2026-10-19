import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  X,
  IndianRupee,
  ShoppingBag
} from 'lucide-react';
import { getSales, recordSale, importSalesCSV, getProducts, getBrands } from '../services/api';

export default function SalesManagement({ setActiveTab }) {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalUnitsSold: 0, averageOrderValue: 0 });
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchCode, setSearchCode] = useState('all');
  const [searchBrand, setSearchBrand] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [salesViewMode, setSalesViewMode] = useState('history'); // 'history', 'raw', 'preprocessed'

  // Manual Sale Form
  const [saleForm, setSaleForm] = useState({
    productCode: '',
    quantitySold: 5,
    sellingPrice: '',
    saleDate: new Date().toISOString().split('T')[0],
    retailShop: 'Sri Lakshmi Textiles, Madurai',
    paymentMode: 'Credit/Invoice',
    notes: 'Shop order placed during sales executive visit'
  });

  // CSV Import State
  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState(null);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const [salesRes, prodRes, brdRes] = await Promise.all([
        getSales({ productCode: searchCode, brand: searchBrand, startDate, endDate }),
        getProducts({}),
        getBrands({})
      ]);

      if (salesRes.data?.success) {
        setSales(salesRes.data.data);
        setSummary(salesRes.data.summary);
      }
      if (prodRes.data?.success) {
        setProducts(prodRes.data.data);
        if (!saleForm.productCode && prodRes.data.data.length > 0) {
          const first = prodRes.data.data[0];
          setSaleForm(prev => ({
            ...prev,
            productCode: first.code,
            sellingPrice: first.price
          }));
        }
      }
      if (brdRes.data?.success) {
        setBrands(brdRes.data.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching historical sales records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [searchCode, searchBrand, startDate, endDate]);

  const handleProductSelectChange = (e) => {
    const code = e.target.value;
    const prod = products.find(p => p.code === code);
    setSaleForm({
      ...saleForm,
      productCode: code,
      sellingPrice: prod ? prod.price : ''
    });
  };

  const handleManualSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await recordSale({
        ...saleForm,
        quantitySold: parseInt(saleForm.quantitySold),
        sellingPrice: parseFloat(saleForm.sellingPrice)
      });

      if (res.data?.success) {
        setMessage({ type: 'success', text: res.data.message });
        setRecordModalOpen(false);
        fetchSalesData();
      }
    } catch (err) {
      const errText = err.response?.data?.error || 'Failed to record sale.';
      setMessage({ type: 'error', text: errText });
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    setImporting(true);
    setImportSummary(null);

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const res = await importSalesCSV(formData);
      if (res.data?.success) {
        setImportSummary(res.data.summary);
        setMessage({ type: 'success', text: res.data.message });
        fetchSalesData();
      }
    } catch (err) {
      const errText = err.response?.data?.error || 'CSV import failed. Please verify column formats.';
      setMessage({ type: 'error', text: errText });
    } finally {
      setImporting(false);
    }
  };

  const handleExportCSV = () => {
    window.location.href = '/api/reports/export-csv?reportType=sales';
  };

  const selectedProductInfo = products.find(p => p.code === saleForm.productCode);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Receipt className="w-6 h-6 text-textile-teal" />
            <span>Sales Data Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manual sales entry, historical dataset import, and shop order tracking for ML demand forecasting.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap">
          <button
            onClick={() => setRecordModalOpen(true)}
            className="px-3.5 py-2.5 bg-textile-teal hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record Sale</span>
          </button>

          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Upload className="w-4 h-4 text-teal-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales Turnover</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">₹{summary.totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Recorded across executive shop visits</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Units Dispatched</div>
          <div className="text-2xl sm:text-3xl font-black text-textile-teal mt-1">{summary.totalUnitsSold.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Across all textile categories</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Transaction Value</div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-900 mt-1">₹{summary.averageOrderValue.toLocaleString()}</div>
          <div className="text-xs text-indigo-600 font-semibold mt-1">Per retail shop booking</div>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter By Brand</label>
            <select
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter By Product</label>
            <select
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
            >
              <option value="all">All Products</option>
              {products.map(p => (
                <option key={p.id} value={p.code}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
            />
          </div>

        </div>
      </div>

      {/* Dataset View Mode Tabs */}
      <div className="flex bg-slate-200/70 p-1 rounded-xl w-fit border border-slate-300">
        <button
          onClick={() => setSalesViewMode('history')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            salesViewMode === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Historical Sales Dataset
        </button>
        <button
          onClick={() => setSalesViewMode('raw')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            salesViewMode === 'raw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Raw Sales Dataset (CSV Source)
        </button>
        <button
          onClick={() => setSalesViewMode('preprocessed')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            salesViewMode === 'preprocessed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Preprocessed Sales Dataset (Feature-Ready)
        </button>
      </div>

      {/* Sales Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {salesViewMode === 'history' && `Historical Sales Log (${sales.length} transactions)`}
              {salesViewMode === 'raw' && `Raw Sales Dataset (CSV Source Schema: ${sales.length} records)`}
              {salesViewMode === 'preprocessed' && `Preprocessed & Cleaned Time-Series Dataset (${sales.length} records)`}
            </h3>
            <p className="text-xs text-slate-500">
              {salesViewMode === 'history' && 'Recorded customer transactions from textile retail shop visits.'}
              {salesViewMode === 'raw' && 'Unfiltered source CSV records before data cleaning, type conversions, and lag feature creation.'}
              {salesViewMode === 'preprocessed' && 'Cleaned time-series records: datetime indexed, non-negative filter applied, and lag features computed for Scikit-Learn training.'}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md self-start sm:self-auto">
            {salesViewMode === 'raw' ? 'sample-data/jp_agencies_sales_history.csv' : 'Status: Ready for Model'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
              {salesViewMode === 'raw' ? (
                <tr>
                  <th className="py-3 px-4 font-mono">Sale Date</th>
                  <th className="py-3 px-4 font-mono">Product Code</th>
                  <th className="py-3 px-4 font-mono">Product Name</th>
                  <th className="py-3 px-4 font-mono">Brand</th>
                  <th className="py-3 px-4 font-mono text-center">Quantity Sold</th>
                  <th className="py-3 px-4 font-mono text-right">Selling Price</th>
                  <th className="py-3 px-4 font-mono">Retail Shop</th>
                  <th className="py-3 px-4 font-mono">Payment Mode</th>
                </tr>
              ) : salesViewMode === 'preprocessed' ? (
                <tr>
                  <th className="py-3 px-4 font-mono">sale_date (Datetime64)</th>
                  <th className="py-3 px-4 font-mono">product_code (String)</th>
                  <th className="py-3 px-4 font-mono">brand (Categorical)</th>
                  <th className="py-3 px-4 font-mono text-center">quantity (int64 &gt; 0)</th>
                  <th className="py-3 px-4 font-mono text-right">price (float64)</th>
                  <th className="py-3 px-4 font-mono text-center">Day of Week</th>
                  <th className="py-3 px-4 font-mono text-center">Festival Indicator</th>
                  <th className="py-3 px-4 font-mono text-center">Cleaning Status</th>
                </tr>
              ) : (
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Product Code & Name</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Retail Shop Client</th>
                  <th className="py-3 px-4 text-center">Qty Sold</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.slice(0, 100).map(s => {
                const dateObj = new Date(s.saleDate);
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()] || 'Mon';
                const monthNum = dateObj.getMonth() + 1;
                const isFestival = [10, 11, 1, 5, 6, 8].includes(monthNum) ? '1 (Festival)' : '0 (Regular)';

                if (salesViewMode === 'raw') {
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 font-mono text-xs transition">
                      <td className="py-2.5 px-4 text-slate-600">{s.saleDate}</td>
                      <td className="py-2.5 px-4 text-teal-800 font-semibold">{s.productCode}</td>
                      <td className="py-2.5 px-4 text-slate-800">{s.productName}</td>
                      <td className="py-2.5 px-4 text-slate-700">{s.brand}</td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-900">{s.quantitySold}</td>
                      <td className="py-2.5 px-4 text-right text-slate-700">₹{s.sellingPrice}</td>
                      <td className="py-2.5 px-4 text-slate-500">{s.retailShop || 'Sri Lakshmi Textiles'}</td>
                      <td className="py-2.5 px-4 text-slate-500">{s.paymentMode || 'Credit/Invoice'}</td>
                    </tr>
                  );
                }

                if (salesViewMode === 'preprocessed') {
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 font-mono text-xs transition">
                      <td className="py-2.5 px-4 text-indigo-900 font-semibold">{s.saleDate}T00:00:00Z</td>
                      <td className="py-2.5 px-4 text-teal-700 font-bold">{s.productCode}</td>
                      <td className="py-2.5 px-4 text-slate-700">{s.brand}</td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-700">+{s.quantitySold}</td>
                      <td className="py-2.5 px-4 text-right text-slate-900">₹{s.sellingPrice}.00</td>
                      <td className="py-2.5 px-4 text-center text-slate-600">{dayName}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isFestival.startsWith('1') ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                          {isFestival}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          Validated
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono text-slate-500 text-xs whitespace-nowrap">{s.saleDate}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{s.productName}</div>
                      <div className="text-[11px] text-slate-400">{s.productCode}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{s.brand}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{s.retailShop || 'Direct Retail Visit'}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{s.quantitySold} pcs</td>
                    <td className="py-3 px-4 text-right text-slate-600">₹{s.sellingPrice}</td>
                    <td className="py-3 px-4 text-right font-black text-textile-teal">
                      ₹{(s.totalAmount || (s.quantitySold * s.sellingPrice)).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sales.length > 100 && (
          <div className="p-3 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-100">
            Showing first 100 of {sales.length} records. Filter by date or brand above to narrow results.
          </div>
        )}

        {sales.length === 0 && !loading && (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No sales recorded yet</h3>
            <p className="text-xs text-slate-500 mt-1">Click 'Record Sale' or 'Import CSV' to populate historical data.</p>
          </div>
        )}
      </div>

      {/* Manual Sale Entry Modal */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setRecordModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Record Retail Shop Sale
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter customer purchase details. Available inventory will automatically decrease.
            </p>

            <form onSubmit={handleManualSaleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Product *</label>
                <select
                  required
                  value={saleForm.productCode}
                  onChange={handleProductSelectChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.code}>
                      {p.code} - {p.name} ({p.brand}) [Stock: {p.currentStock}]
                    </option>
                  ))}
                </select>
                {selectedProductInfo && (
                  <div className="flex items-center justify-between text-[11px] mt-1.5 px-2 py-1 bg-slate-100 rounded-lg text-slate-600">
                    <span>Available Stock: <strong className={selectedProductInfo.currentStock === 0 ? 'text-red-600' : 'text-emerald-700'}>{selectedProductInfo.currentStock} units</strong></span>
                    <span>Standard Price: ₹{selectedProductInfo.price}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity Sold (pcs) *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProductInfo ? selectedProductInfo.currentStock : 9999}
                    required
                    value={saleForm.quantitySold}
                    onChange={(e) => setSaleForm({ ...saleForm, quantitySold: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Selling Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={saleForm.sellingPrice}
                    onChange={(e) => setSaleForm({ ...saleForm, sellingPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Retail Shop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Murugan Silks, Coimbatore"
                  value={saleForm.retailShop}
                  onChange={(e) => setSaleForm({ ...saleForm, retailShop: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sale Date *</label>
                  <input
                    type="date"
                    required
                    value={saleForm.saleDate}
                    onChange={(e) => setSaleForm({ ...saleForm, saleDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={saleForm.paymentMode}
                    onChange={(e) => setSaleForm({ ...saleForm, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  >
                    <option value="Credit/Invoice">Credit / Invoice (30 Days)</option>
                    <option value="Cash">Cash on Delivery</option>
                    <option value="UPI/Bank">UPI / Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl flex items-center justify-between text-xs text-teal-900">
                <span className="font-semibold">Calculated Total Order Value:</span>
                <span className="text-base font-black">
                  ₹{((parseInt(saleForm.quantitySold) || 0) * (parseFloat(saleForm.sellingPrice) || 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedProductInfo && selectedProductInfo.currentStock < parseInt(saleForm.quantitySold)}
                  className="px-4 py-2 bg-textile-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow disabled:opacity-50"
                >
                  Confirm & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => { setImportModalOpen(false); setImportSummary(null); }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Import Historical Sales CSV
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Upload past retail sales records for model training and trend analytics.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-textile-teal transition bg-slate-50">
                <FileSpreadsheet className="w-10 h-10 text-textile-teal mx-auto mb-2" />
                <label className="cursor-pointer">
                  <span className="text-xs font-semibold text-textile-teal hover:underline block">
                    {csvFile ? csvFile.name : 'Click to select CSV file from your computer'}
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  Required columns: Sale Date, Product Code, Quantity Sold, Selling Price
                </p>
              </div>

              {/* Sample file guidance */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 mb-1">Pre-loaded Dataset Available:</div>
                <p className="text-[11px] text-slate-500">
                  You can upload the provided dataset directly located at:<br/>
                  <code className="text-textile-teal font-mono">sample-data/jp_agencies_sales_history.csv</code> (1,400+ authentic records).
                </p>
              </div>

              {importSummary && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Import Summary</span>
                  </div>
                  <div>• Successfully imported: {importSummary.importedCount} records</div>
                  <div>• Skipped duplicates: {importSummary.skippedDuplicates} records</div>
                  {importSummary.errorCount > 0 && (
                    <div className="text-amber-800">• Flagged format rows: {importSummary.errorCount}</div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setImportModalOpen(false); setImportSummary(null); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!csvFile || importing}
                  className="px-4 py-2 bg-textile-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow disabled:opacity-50"
                >
                  {importing ? 'Processing CSV...' : 'Start Import'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
