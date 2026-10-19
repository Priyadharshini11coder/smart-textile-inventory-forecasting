import React, { useState, useEffect } from 'react';
import {
  Boxes,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  Search,
  Filter,
  History,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { getInventory, adjustStock, getTransactions, getBrands } from '../services/api';

export default function InventoryManagement({ setActiveTab }) {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ totalProducts: 0, totalUnitsInStock: 0, lowStockCount: 0, outOfStockCount: 0, inStockCount: 0 });
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Tabs: 'stock' or 'history'
  const [activeView, setActiveView] = useState('stock');
  const [transactions, setTransactions] = useState([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    type: 'ADD', // 'ADD', 'REDUCE', 'ADJUSTMENT'
    quantity: 10,
    reason: 'Replenishment order received',
    date: new Date().toISOString().split('T')[0]
  });
  const [message, setMessage] = useState(null);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [invRes, brdRes] = await Promise.all([
        getInventory({ search, brand: selectedBrand, status: selectedStatus }),
        getBrands()
      ]);

      if (invRes.data?.success) {
        setItems(invRes.data.data);
        setSummary(invRes.data.summary);
      }
      if (brdRes.data?.success) {
        setBrands(brdRes.data.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching inventory details.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionLogs = async () => {
    try {
      const res = await getTransactions({});
      if (res.data?.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    if (activeView === 'history') fetchTransactionLogs();
  }, [selectedBrand, selectedStatus, activeView]);

  const handleOpenAdjust = (item) => {
    setSelectedItem(item);
    setAdjustForm({
      type: 'ADD',
      quantity: 10,
      reason: 'Batch stock replenishment',
      date: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const res = await adjustStock({
        productId: selectedItem.id,
        type: adjustForm.type,
        quantity: parseInt(adjustForm.quantity),
        reason: adjustForm.reason,
        date: adjustForm.date
      });

      if (res.data?.success) {
        setMessage({ type: 'success', text: res.data.message });
        setModalOpen(false);
        fetchInventoryData();
        if (activeView === 'history') fetchTransactionLogs();
      }
    } catch (err) {
      const errText = err.response?.data?.error || 'Failed to adjust stock.';
      setMessage({ type: 'error', text: errText });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-textile-teal" />
            <span>Inventory Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time stock level monitoring, batch adjustments, and transaction audit trails.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
              activeView === 'stock' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Current Stock</span>
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
              activeView === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Total In-Stock Units</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{summary.totalUnitsInStock.toLocaleString()}</div>
          <div className="text-[11px] text-teal-600 font-semibold mt-0.5">Across {summary.totalProducts} distinct SKUs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Normal Stock Products</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{summary.inStockCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Above minimum threshold</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Low Stock Warnings</div>
          <div className="text-2xl font-black text-amber-500 mt-1">{summary.lowStockCount}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-0.5">Reorder recommended</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Out of Stock Items</div>
          <div className="text-2xl font-black text-red-500 mt-1">{summary.outOfStockCount}</div>
          <div className="text-[11px] text-red-600 font-medium mt-0.5">Zero stock available</div>
        </div>
      </div>

      {/* Notification */}
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

      {activeView === 'stock' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search inventory by product name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchInventoryData()}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
            >
              <option value="all">All Stock Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Current Stock Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">SKU / Code</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Brand</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">Available Stock</th>
                    <th className="py-3.5 px-4 text-center">Threshold</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{item.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.size} • {item.color}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{item.brand}</td>
                      <td className="py-3 px-4 text-slate-500">{item.category}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-base font-black text-slate-900">{item.currentStock}</span>
                        <span className="text-[11px] text-slate-400 ml-1">pcs</span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 text-xs">
                        {item.minStockThreshold} pcs
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.stockStatus === 'Out of Stock' ? 'bg-red-100 text-red-700 border border-red-200' :
                          item.stockStatus === 'Low Stock' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {item.stockStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(item)}
                          className="px-3 py-1.5 bg-textile-teal/10 hover:bg-textile-teal hover:text-white text-textile-teal font-semibold rounded-lg text-xs transition inline-flex items-center space-x-1"
                        >
                          <span>Adjust Stock</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Inventory Transaction History Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Inventory Transaction History (Audit Trail)</h3>
            <span className="text-xs text-slate-400">{transactions.length} records logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Product Code & Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Change</th>
                  <th className="py-3 px-4 text-center">Before → After</th>
                  <th className="py-3 px-4">Reason / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-slate-500 font-mono text-xs">{tx.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{tx.productName}</div>
                      <div className="text-[11px] text-slate-400">{tx.productCode} • {tx.brand}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        tx.type === 'ADD' ? 'bg-emerald-100 text-emerald-800' :
                        tx.type === 'SALE' ? 'bg-sky-100 text-sky-800' :
                        tx.type === 'REDUCE' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      <span className={tx.quantityDelta > 0 ? 'text-emerald-600' : tx.quantityDelta < 0 ? 'text-sky-700' : 'text-slate-600'}>
                        {tx.quantityDelta > 0 ? `+${tx.quantityDelta}` : tx.quantityDelta}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-slate-600 font-medium">
                      {tx.previousStock} → <span className="font-bold text-slate-900">{tx.newStock}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{tx.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Adjust Stock Level
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              {selectedItem.name} ({selectedItem.code}) • Current Stock: <strong className="text-slate-800">{selectedItem.currentStock} pcs</strong>
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, type: 'ADD', reason: 'Warehouse Restock Received' })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition ${
                      adjustForm.type === 'ADD' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    + Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, type: 'REDUCE', reason: 'Damaged / Defective piece' })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition ${
                      adjustForm.type === 'REDUCE' ? 'bg-red-600 text-white border-red-600 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    - Reduce Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, type: 'ADJUSTMENT', reason: 'Physical stock audit adjustment' })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition ${
                      adjustForm.type === 'ADJUSTMENT' ? 'bg-sky-600 text-white border-sky-600 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {adjustForm.type === 'ADD' ? 'Quantity to Add (pcs)' :
                   adjustForm.type === 'REDUCE' ? 'Quantity to Reduce (pcs)' :
                   'Exact New Stock Count (pcs)'}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adjustment Reason / Notes *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Received new shipment from Balaji Garments"
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={adjustForm.date}
                  onChange={(e) => setAdjustForm({ ...adjustForm, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-textile-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow"
                >
                  Save Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
