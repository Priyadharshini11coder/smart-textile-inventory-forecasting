import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Boxes,
  Shirt,
  Layers,
  Calendar,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { getReportSummaries } from '../services/api';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'product_sales', 'brand_sales'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await getReportSummaries();
        if (res.data?.success) {
          setReportData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExport = (type) => {
    window.location.href = `/api/reports/export-csv?reportType=${type}`;
  };

  const inventoryReport = reportData?.inventoryReport || [];
  const productSalesReport = reportData?.productSalesReport || [];
  const brandSalesReport = reportData?.brandSalesReport || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-textile-teal" />
            <span>Reports & Business Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate and export inventory valuation, sales reports, and brand-wise performance breakdowns.
          </p>
        </div>

        <button
          onClick={() => handleExport(activeTab === 'inventory' ? 'inventory' : 'sales')}
          className="px-4 py-2.5 bg-textile-teal hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow transition flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export {activeTab.replace('_', ' ').toUpperCase()} to CSV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/70 p-1 rounded-xl w-fit border border-slate-300">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Current Inventory & Valuation</span>
        </button>
        <button
          onClick={() => setActiveTab('product_sales')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === 'product_sales' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Product-Wise Sales</span>
        </button>
        <button
          onClick={() => setActiveTab('brand_sales')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === 'brand_sales' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Brand-Wise Sales</span>
        </button>
      </div>

      {/* Content based on tab */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Textile Inventory Valuation Report</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Total Stock Valuation: ₹{inventoryReport.reduce((sum, p) => sum + (p.valuation || 0), 0).toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Stock Value</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryReport.map(item => (
                  <tr key={item.code} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{item.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 text-slate-600">{item.brand}</td>
                    <td className="py-3 px-4 text-slate-500">{item.category}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.stock} pcs</td>
                    <td className="py-3 px-4 text-right text-slate-700">₹{item.price}</td>
                    <td className="py-3 px-4 text-right font-black text-textile-teal">₹{item.valuation.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                        item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'product_sales' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Product-Wise Sales & Volume Report</h3>
            <span className="text-xs text-slate-400">{productSalesReport.length} products tracked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product Code & Name</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productSalesReport.map(item => (
                  <tr key={item.code} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.code}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{item.brand}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{item.unitsSold.toLocaleString()} units</td>
                    <td className="py-3 px-4 text-right font-black text-textile-teal">₹{Math.round(item.totalRevenue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'brand_sales' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Brand-Wise Performance & Market Share Report</h3>
            <span className="text-xs text-slate-400">{brandSalesReport.length} manufacturing partners</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Manufacturing Brand</th>
                  <th className="py-3 px-4 text-center">Total Units Dispatched</th>
                  <th className="py-3 px-4 text-right">Gross Sales Turnover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {brandSalesReport.map(item => (
                  <tr key={item.brand} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">{item.brand}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{item.unitsSold.toLocaleString()} units</td>
                    <td className="py-3 px-4 text-right font-black text-textile-teal">₹{Math.round(item.totalRevenue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
