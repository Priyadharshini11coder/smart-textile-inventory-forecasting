import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
  Package,
  Phone,
  Info,
  X,
  Shirt,
  Boxes,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  getBrands,
  addBrand,
  updateBrand,
  deleteBrand,
  getProducts,
  adjustStock
} from '../services/api';
import { getProductImage } from '../services/textileImages';

export default function BrandManagement({ onBrandClick }) {
  const [brands, setBrands] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandForm, setBrandForm] = useState({ name: '', code: '', contact: '', description: '', status: 'Active' });
  const [message, setMessage] = useState(null);
  const [selectedBrandProducts, setSelectedBrandProducts] = useState(null);

  // Quick stock edit in brand drawer
  const [editingStockItem, setEditingStockItem] = useState(null);
  const [stockEditQty, setStockEditQty] = useState(10);
  const [stockEditType, setStockEditType] = useState('ADD');

  const fetchBrandsAndProducts = async () => {
    setLoading(true);
    try {
      const [brandRes, prodRes] = await Promise.all([getBrands(), getProducts({})]);
      if (brandRes.data?.success) {
        setBrands(brandRes.data.data);
      }
      if (prodRes.data?.success) {
        setAllProducts(prodRes.data.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch textile brands from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandsAndProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setBrandForm({ name: '', code: '', contact: '', description: '', status: 'Active' });
    setModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setBrandForm({
      name: brand.name,
      code: brand.code,
      contact: brand.contact || '',
      description: brand.description || '',
      status: brand.status || 'Active'
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return;

    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, brandForm);
        setMessage({ type: 'success', text: `Brand '${brandForm.name}' updated successfully.` });
      } else {
        await addBrand(brandForm);
        setMessage({ type: 'success', text: `Brand '${brandForm.name}' created successfully.` });
      }
      setModalOpen(false);
      fetchBrandsAndProducts();
    } catch (err) {
      const errText = err.response?.data?.error || 'Failed to save brand.';
      setMessage({ type: 'error', text: errText });
    }
  };

  const handleDelete = async (brand) => {
    if (!window.confirm(`Are you sure you want to delete brand '${brand.name}'?`)) return;

    try {
      await deleteBrand(brand.id);
      setMessage({ type: 'success', text: `Brand '${brand.name}' deleted successfully.` });
      fetchBrandsAndProducts();
    } catch (err) {
      const errText = err.response?.data?.error || 'Cannot delete brand due to dependent product records.';
      setMessage({ type: 'error', text: errText });
    }
  };

  const viewBrandProducts = async (brand) => {
    try {
      const res = await getProducts({ brand: brand.name });
      if (res.data?.success) {
        setSelectedBrandProducts({ brand, products: res.data.data });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching products for this brand.' });
    }
  };

  const handleStockUpdateFromBrand = async (e) => {
    e.preventDefault();
    if (!editingStockItem) return;

    try {
      const res = await adjustStock({
        productId: editingStockItem.id,
        type: stockEditType,
        quantity: parseInt(stockEditQty),
        reason: 'Brand catalog quick update',
        date: new Date().toISOString().split('T')[0]
      });

      if (res.data?.success) {
        setMessage({ type: 'success', text: res.data.message });
        setEditingStockItem(null);
        if (selectedBrandProducts) {
          viewBrandProducts(selectedBrandProducts.brand);
        }
        fetchBrandsAndProducts();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update stock.' });
    }
  };

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.code.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to get categories for a brand
  const getBrandCategories = (brandName) => {
    const prods = allProducts.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());
    const cats = [...new Set(prods.map(p => p.category))];
    if (cats.length > 0) return cats;
    if (brandName === 'RPK') return ['Shirts', 'Dhoti and Shirt Set', 'Dhoti'];
    if (brandName === 'Balaji Garments') return ['Premium Shirts'];
    if (brandName === 'Carvel') return ["Girls' Innerwear", "Boys' Innerwear"];
    return ['General Apparel'];
  };

  // Helper to get preview images for brand card
  const getBrandSampleImages = (brandName) => {
    const prods = allProducts.filter(p => p.brand.toLowerCase() === brandName.toLowerCase());
    return prods.slice(0, 4).map(p => p.image || getProductImage(p.category, p.code, p.brand));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-textile-teal border border-teal-200 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Manufacturing & Brand Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Brand Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain manufacturing partners: RPK, Balaji Garments, and Carvel. Manage products, prices, and stock quantities.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-textile-teal hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Alert Notification */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search brands by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
        />
      </div>

      {/* Brands Grid with Realistic Product Image Showcases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => {
          const sampleImages = getBrandSampleImages(brand.name);
          const brandCategories = getBrandCategories(brand.name);
          const brandProdCount = allProducts.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase()).length;
          const badgeColor =
            brand.name === 'RPK' ? 'bg-teal-700 text-white' :
            brand.name === 'Balaji Garments' ? 'bg-indigo-700 text-white' :
            'bg-rose-700 text-white';

          return (
            <div
              key={brand.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-slate-900 text-xl">{brand.name}</h3>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded shadow-sm ${badgeColor}`}>
                        {brand.code}
                      </span>
                    </div>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {brand.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(brand)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                      title="Edit Brand"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(brand)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>

                {/* Categories Pills */}
                <div className="mt-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Product Categories:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {brandCategories.map(c => (
                      <span
                        key={c}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* REALISTIC PRODUCT PHOTOGRAPHS PREVIEW GRID */}
                <div className="mt-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Catalog Product Photography:
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleImages.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className="h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer hover:opacity-90 transition"
                        onClick={() => viewBrandProducts(brand)}
                      >
                        <img
                          src={imgSrc}
                          alt="Product Sample"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {brand.contact && (
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Manufacturer Rep: {brand.contact}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-800 font-bold">
                  <Package className="w-4 h-4 text-textile-teal" />
                  <span>{brandProdCount} Products Registered</span>
                </div>

                <button
                  onClick={() => viewBrandProducts(brand)}
                  className="px-3 py-1.5 bg-textile-teal/10 hover:bg-textile-teal hover:text-white text-textile-teal font-bold rounded-lg text-xs transition flex items-center space-x-1"
                >
                  <span>Manage Products</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && !loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No brands found</h3>
          <p className="text-xs text-slate-500 mt-1">Try refining your search query or add a new brand.</p>
        </div>
      )}

      {/* BRAND PRODUCTS MANAGEMENT MODAL */}
      {selectedBrandProducts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[88vh] flex flex-col relative">
            <button
              onClick={() => setSelectedBrandProducts(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {selectedBrandProducts.brand.name} Catalog & Products
                </h2>
                <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                  {selectedBrandProducts.products.length} Products
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                View realistic product photography, current selling prices, sizes, and stock quantities.
              </p>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
              {selectedBrandProducts.products.map(p => (
                <div key={p.id} className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={p.image || getProductImage(p.category, p.code, p.brand)}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        {p.code} • {p.category}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        Sizes: <span className="font-semibold">{p.size}</span> | Colour: <span className="font-semibold">{p.color}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0">
                    <div className="text-right">
                      <div className="font-black text-slate-900 text-base">₹{p.price}</div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.currentStock === 0 ? 'bg-red-100 text-red-800' :
                        p.currentStock <= p.minStockThreshold ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.currentStock} in stock
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setEditingStockItem(p);
                        setStockEditQty(10);
                        setStockEditType('ADD');
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <Boxes className="w-3.5 h-3.5" />
                      <span>Stock</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedBrandProducts(null);
                  if (onBrandClick) onBrandClick();
                }}
                className="text-xs font-bold text-textile-teal hover:underline flex items-center space-x-1"
              >
                <span>Open Full Catalog Showroom View →</span>
              </button>

              <button
                onClick={() => setSelectedBrandProducts(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK STOCK ADJUSTMENT MODAL FOR BRAND DRAWER */}
      {editingStockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setEditingStockItem(null)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-1">Update Stock: {editingStockItem.name}</h3>
            <p className="text-xs text-slate-500 mb-3">Current: {editingStockItem.currentStock} pcs</p>

            <form onSubmit={handleStockUpdateFromBrand} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStockEditType('ADD')}
                  className={`py-1.5 text-xs font-bold rounded-lg border ${
                    stockEditType === 'ADD' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50'
                  }`}
                >
                  + Add Stock
                </button>
                <button
                  type="button"
                  onClick={() => setStockEditType('REDUCE')}
                  className={`py-1.5 text-xs font-bold rounded-lg border ${
                    stockEditType === 'REDUCE' ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50'
                  }`}
                >
                  - Reduce
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={stockEditQty}
                  onChange={(e) => setStockEditQty(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingStockItem(null)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-textile-teal text-white rounded-lg text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Brand Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingBrand ? 'Edit Textile Brand' : 'Add New Textile Brand'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RPK"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Code (SKU Prefix)</label>
                  <input
                    type="text"
                    placeholder="e.g. RPK"
                    value={brandForm.code}
                    onChange={(e) => setBrandForm({ ...brandForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={brandForm.status}
                    onChange={(e) => setBrandForm({ ...brandForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone / Rep</label>
                <input
                  type="text"
                  placeholder="+91 94432 10101"
                  value={brandForm.contact}
                  onChange={(e) => setBrandForm({ ...brandForm, contact: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Product Lines</label>
                <textarea
                  rows="3"
                  placeholder="Fabric categories, specialties, notes..."
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
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
                  {editingBrand ? 'Save Changes' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
