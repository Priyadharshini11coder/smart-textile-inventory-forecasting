import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Activity, ShieldCheck, Smartphone, Layers } from 'lucide-react';
import { getMLHealth } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) {
  const [mlOnline, setMlOnline] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getMLHealth()
      .then(res => {
        if (res.data?.success) setMlOnline(true);
      })
      .catch(() => setMlOnline(false))
      .finally(() => setChecking(false));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile hamburger & App Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-textile-navy to-textile-teal flex items-center justify-center text-white shadow-md">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">JP AGENCIES</span>
                  <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    Textile Suite
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden md:block">Smart Inventory Management & ML Demand Forecasting</p>
              </div>
            </div>
          </div>

          {/* Right: Service Health Indicators & Executive Mode */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* ML Status Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 border-slate-200">
              <span className={`w-2 h-2 rounded-full ${mlOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <Sparkles className="w-3.5 h-3.5 text-textile-teal" />
              <span className="hidden sm:inline text-slate-700">ML Engine:</span>
              <span className={mlOnline ? 'text-emerald-700 font-semibold' : 'text-amber-700'}>
                {checking ? 'Checking...' : (mlOnline ? 'RandomForest Ready' : 'Standby')}
              </span>
            </div>

            {/* Sales Executive Portal Badge */}
            <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span>Sales Executive Field Portal</span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
