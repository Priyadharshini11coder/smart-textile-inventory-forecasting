import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BrandManagement from './pages/BrandManagement';
import ProductCatalog from './pages/ProductCatalog';
import InventoryManagement from './pages/InventoryManagement';
import SalesManagement from './pages/SalesManagement';
import DemandForecast from './pages/DemandForecast';
import Reports from './pages/Reports';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex w-full">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Application Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <div className="max-w-[1600px] w-full mx-auto">
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'brands' && <BrandManagement onBrandClick={() => setActiveTab('products')} />}
            {activeTab === 'products' && <ProductCatalog setActiveTab={setActiveTab} />}
            {activeTab === 'inventory' && <InventoryManagement setActiveTab={setActiveTab} />}
            {activeTab === 'sales' && <SalesManagement setActiveTab={setActiveTab} />}
            {activeTab === 'forecast' && <DemandForecast setActiveTab={setActiveTab} />}
            {activeTab === 'reports' && <Reports />}
          </div>
        </main>
      </div>
    </div>
  );
}
