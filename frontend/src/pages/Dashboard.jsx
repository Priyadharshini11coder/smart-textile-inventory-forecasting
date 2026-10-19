import React, { useState, useEffect } from 'react';
import {
  Package,
  Layers,
  AlertTriangle,
  XCircle,
  TrendingUp,
  IndianRupee,
  Sparkles,
  ArrowRight,
  Boxes,
  PlusCircle,
  Clock,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from 'recharts';
import { getDashboardStats } from '../services/api';

const BRAND_COLORS = ['#0D9488', '#0284C7', '#D97706', '#8B5CF6', '#EC4899'];

export default function Dashboard({ setActiveTab, onQuickRestock }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardStats();
      if (res.data?.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setError('Unable to load real-time statistics from backend. Please ensure the server is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-textile-teal animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Loading JP Agencies Live Inventory & Sales Dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl max-w-2xl mx-auto my-8 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-red-900">Dashboard Connection Error</h3>
        <p className="text-sm text-red-700 mt-1">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-textile-navy rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Textile Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            JP Agencies — Sales Executive Dashboard
          </h1>
          <p className="text-slate-300 text-sm mt-1 leading-relaxed">
            Live catalog tracking for RPK, Balaji Garments, and Carvel. Monitor warehouse stocks, log retail shop transactions, and generate machine learning forecasts.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('sales')}
              className="px-4 py-2 bg-textile-teal hover:bg-teal-600 text-white text-xs font-semibold rounded-lg shadow transition flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Retail Sale</span>
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className="px-4 py-2 bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-600 transition flex items-center space-x-1.5"
            >
              <TrendingUp className="w-4 h-4 text-teal-300" />
              <span>View ML Forecast</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition flex items-center space-x-1.5"
            >
              <Package className="w-4 h-4" />
              <span>Browse Products</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total Products</span>
            <Package className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalProducts}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 3 Partner Brands</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Textile Brands</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalBrands}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active Partnerships</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Stock on Hand</span>
            <Boxes className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalStock.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Available Units</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`text-2xl font-black ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {stats.lowStockCount}
          </div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">Threshold reached</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Out of Stock</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className={`text-2xl font-black ${stats.outOfStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {stats.outOfStockCount}
          </div>
          <div className="text-[11px] text-red-600 mt-1 font-medium">Stockouts detected</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Recorded Sales</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{(stats.totalSalesRevenue / 100000).toFixed(2)}L
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            {stats.totalSalesQuantity.toLocaleString()} units sold
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Sales Volume & Revenue</h3>
              <p className="text-xs text-slate-500">Historical sales volume trends from recorded shop visits</p>
            </div>
            <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              Real Database Data
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(value, name) => [value.toLocaleString(), name === 'units' ? 'Units Sold' : 'Revenue (₹)']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="units" name="units" stroke="#0D9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUnits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Sales Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Brand Sales Volume</h3>
            <p className="text-xs text-slate-500">Share of units sold by textile brand</p>

            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.brandDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="units"
                  >
                    {(stats.brandDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val.toLocaleString()} units`, 'Sold']}
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Leading Partner:</span>
            <span className="font-bold text-slate-800">
              {stats.brandDistribution?.[0]?.name || 'RPK Carewell'}
            </span>
          </div>
        </div>

      </div>

      {/* Tables Row: Best Sellers & Recent Stock Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Best Sellers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Best-Selling Textile Products</h3>
              <p className="text-xs text-slate-500">Based on recorded sales visits</p>
            </div>
            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-semibold text-textile-teal hover:underline flex items-center"
            >
              <span>View All Sales</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.bestSellers && stats.bestSellers.length > 0 ? (
              stats.bestSellers.map((item, idx) => (
                <div key={item.code} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.code} • {item.brand}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-textile-teal">{item.unitsSold.toLocaleString()} units</div>
                    <div className="text-xs text-slate-400">₹{(item.revenue).toLocaleString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No sales records available yet.</p>
            )}
          </div>
        </div>

        {/* Recent Inventory Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Inventory Movements</h3>
              <p className="text-xs text-slate-500">Real-time stock adjustments and audit trail</p>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-semibold text-textile-teal hover:underline flex items-center"
            >
              <span>Audit History</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentTransactions && stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-slate-900 flex items-center space-x-1.5">
                      <span>{tx.productName}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'ADD' ? 'bg-emerald-100 text-emerald-800' :
                        tx.type === 'SALE' ? 'bg-sky-100 text-sky-800' :
                        tx.type === 'REDUCE' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {tx.type}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{tx.reason} • {tx.date}</div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${tx.quantityDelta > 0 ? 'text-emerald-600' : tx.quantityDelta < 0 ? 'text-sky-700' : 'text-slate-600'}`}>
                      {tx.quantityDelta > 0 ? `+${tx.quantityDelta}` : tx.quantityDelta}
                    </span>
                    <div className="text-[10px] text-slate-400">Stock: {tx.newStock}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No recent stock movements.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
