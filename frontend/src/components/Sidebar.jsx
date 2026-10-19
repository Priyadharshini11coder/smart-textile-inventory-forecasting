import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Shirt,
  Boxes,
  Receipt,
  TrendingUp,
  BarChart3,
  Smartphone,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'brands', label: 'Brand Management', icon: Building2 },
    { id: 'products', label: 'Product Catalog', icon: Shirt },
    { id: 'inventory', label: 'Inventory Stock', icon: Boxes },
    { id: 'sales', label: 'Sales Records', icon: Receipt },
    { id: 'forecast', label: 'Demand Forecasting', icon: TrendingUp, highlight: true },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Application Mode</div>
        <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-between">
          <span>Multi-Brand Sales Executive</span>
          <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded">B2B</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">RPK • Balaji Garments • Carvel</p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-textile-teal text-white shadow-md shadow-teal-900/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.highlight ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.highlight && !isActive && (
                <span className="flex items-center text-[10px] font-bold bg-teal-400/20 text-teal-300 px-1.5 py-0.5 rounded">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" /> ML
                </span>
              )}
              {isActive && <ChevronRight className="w-4 h-4 text-white" />}
            </button>
          );
        })}
      </div>

      {/* Mobile/Field Assistant Card */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-teal-400 font-semibold mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Field Ready Design</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Optimized for tablet & phone displays during textile shop visits.
          </p>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 shrink-0 shadow-lg z-30">
        {navContent}
      </aside>

      {/* Mobile Sliding Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
