import React, { useState, useEffect } from 'react';
import {
  Shirt,
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Tag,
  Boxes,
  X,
  Upload,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Layers,
  ShoppingBag
} from 'lucide-react';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  adjustStock,
  uploadProductImage
} from '../services/api';
import { getProductImage, PRODUCT_IMAGE_PRESETS } from '../services/textileImages';

export default function ProductCatalog({ setActiveTab }) {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  // Brand-first section selection: 'all', 'RPK', 'Balaji Garments', 'Carvel'
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [search, setSearch] = useState('');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailsModalProduct, setDetailsModalProduct] = useState(null);
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [sampleOrderProduct, setSampleOrderProduct] = useState(null);
  const [quickStockQty, setQuickStockQty] = useState(10);
  const [quickStockType, setQuickStockType] = useState('ADD');
  const [quickStockReason, setQuickStockReason] = useState('Stock replenishment');

  const [message, setMessage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    brand: 'RPK',
    category: 'Shirts',
    size: '38, 40, 42, 44',
    color: 'Sky Blue',
    price: 240,
    currentStock: 30,
    minStockThreshold: 15,
    description: '',
    image: '/assets/products/rpk-shirt-blue.jpg'
  });

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [prodRes, brandRes] = await Promise.all([
        getProducts({
          brand: selectedBrand,
          category: selectedCategory,
          stockStatus: selectedStockStatus,
          search,
          sortBy
        }),
        getBrands()
      ]);

      if (prodRes.data?.success) setProducts(prodRes.data.data);
      if (brandRes.data?.success) setBrands(brandRes.data.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error fetching products catalogue.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedBrand, selectedCategory, selectedStockStatus, sortBy]);

  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    const defaultBrand = selectedBrand !== 'all' ? selectedBrand : 'RPK';
    const defaultCategory =
      defaultBrand === 'RPK' ? 'Shirts' :
      defaultBrand === 'Balaji Garments' ? 'Premium Shirts' : "Girls' Innerwear";

    setFormData({
      code: '',
      name: '',
      brand: defaultBrand,
      category: defaultCategory,
      size: '38, 40, 42, 44',
      color: 'Classic Blue',
      price: defaultBrand === 'Balaji Garments' ? 480 : defaultBrand === 'RPK' ? 240 : 180,
      currentStock: 30,
      minStockThreshold: 15,
      description: '',
      image: '/assets/products/rpk-shirt-blue.jpg'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      code: p.code,
      name: p.name,
      brand: p.brand,
      category: p.category,
      size: p.size,
      color: p.color,
      price: p.price,
      currentStock: p.currentStock,
      minStockThreshold: p.minStockThreshold,
      description: p.description || '',
      image: p.image || getProductImage(p.category, p.code, p.brand)
    });
    setModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    try {
      const res = await uploadProductImage(data);
      if (res.data?.success) {
        setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
        setMessage({ type: 'success', text: 'Product photograph uploaded successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        setMessage({ type: 'success', text: `Product '${formData.name}' updated successfully.` });
      } else {
        await addProduct(formData);
        setMessage({ type: 'success', text: `Product '${formData.name}' added with SKU ${formData.code}.` });
      }
      setModalOpen(false);
      fetchCatalog();
    } catch (err) {
      const errText = err.response?.data?.error || 'Failed to save product.';
      setMessage({ type: 'error', text: errText });
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Are you sure you want to remove product '${p.name}' (${p.code})?`)) return;

    try {
      await deleteProduct(p.id);
      setMessage({ type: 'success', text: `Product '${p.name}' removed from catalogue.` });
      fetchCatalog();
    } catch (err) {
      const errText = err.response?.data?.error || 'Cannot delete product with historical sales records.';
      setMessage({ type: 'error', text: errText });
    }
  };

  const handleQuickStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;

    try {
      const res = await adjustStock({
        productId: stockModalProduct.id,
        type: quickStockType,
        quantity: parseInt(quickStockQty),
        reason: quickStockReason,
        date: new Date().toISOString().split('T')[0]
      });

      if (res.data?.success) {
        setMessage({ type: 'success', text: res.data.message });
        setStockModalProduct(null);
        fetchCatalog();
      }
    } catch (err) {
      const errText = err.response?.data?.error || 'Failed to adjust stock.';
      setMessage({ type: 'error', text: errText });
    }
  };

  // Dynamic categories based on active brand
  const getCategoriesForBrand = () => {
    if (selectedBrand === 'RPK') {
      return ['All', 'Shirts', 'Dhoti and Shirt Set', 'Dhoti'];
    }
    if (selectedBrand === 'Balaji Garments') {
      return ['All', 'Premium Shirts'];
    }
    if (selectedBrand === 'Carvel') {
      return ['All', "Girls' Innerwear", "Boys' Innerwear"];
    }
    return ['All', 'Shirts', 'Dhoti and Shirt Set', 'Dhoti', 'Premium Shirts', "Girls' Innerwear", "Boys' Innerwear"];
  };

  // Filter products by selected size and color client-side for immediate responsiveness
  let displayedProducts = products;
  if (selectedSize !== 'all') {
    displayedProducts = displayedProducts.filter(p =>
      (p.size || '').toLowerCase().includes(selectedSize.toLowerCase())
    );
  }
  if (selectedColor !== 'all') {
    displayedProducts = displayedProducts.filter(p =>
      (p.color || '').toLowerCase().includes(selectedColor.toLowerCase())
    );
  }

  // Count products by brand
  const rpkCount = products.filter(p => p.brand === 'RPK').length;
  const bgCount = products.filter(p => p.brand === 'Balaji Garments').length;
  const carvelCount = products.filter(p => p.brand === 'Carvel').length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-textile-teal border border-teal-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Multi-Brand Showroom</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Shirt className="w-7 h-7 text-textile-teal" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and showcase multi-brand textile collections to retail customers on phones or tablets during field visits.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View mode toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                viewMode === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Presentation Card View (for field sales visits)"
            >
              <LayoutGrid className="w-4 h-4 text-textile-teal" />
              <span className="hidden sm:inline">Card Presentation</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table Admin View"
            >
              <List className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Table Admin</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-textile-teal hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Alert banner */}
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

      {/* TOP BRAND SELECTION AREA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Brand Section</span>
          <span className="text-xs text-slate-500 font-medium">Viewing {displayedProducts.length} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          {/* All Brands */}
          <button
            onClick={() => handleBrandSelect('all')}
            className={`p-4 rounded-xl border text-left transition relative ${
              selectedBrand === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base">All Brands</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedBrand === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {products.length}
              </span>
            </div>
            <p className={`text-xs mt-1 line-clamp-1 ${selectedBrand === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
              Complete multi-brand textile catalog
            </p>
          </button>

          {/* RPK Brand */}
          <button
            onClick={() => handleBrandSelect('RPK')}
            className={`p-4 rounded-xl border text-left transition relative ${
              selectedBrand === 'RPK'
                ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-700/20'
                : 'bg-teal-50/50 text-slate-800 border-teal-100 hover:bg-teal-50 hover:border-teal-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base">RPK</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedBrand === 'RPK' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'}`}>
                {rpkCount || 12} items
              </span>
            </div>
            <p className={`text-xs mt-1 line-clamp-1 ${selectedBrand === 'RPK' ? 'text-teal-100' : 'text-slate-500'}`}>
              Shirts (₹200–₹300) • Dhoti Sets • Dhotis
            </p>
          </button>

          {/* Balaji Garments Brand */}
          <button
            onClick={() => handleBrandSelect('Balaji Garments')}
            className={`p-4 rounded-xl border text-left transition relative ${
              selectedBrand === 'Balaji Garments'
                ? 'bg-indigo-700 text-white border-indigo-700 shadow-md ring-2 ring-indigo-700/20'
                : 'bg-indigo-50/50 text-slate-800 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base">Balaji Garments</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedBrand === 'Balaji Garments' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'}`}>
                {bgCount || 6} items
              </span>
            </div>
            <p className={`text-xs mt-1 line-clamp-1 ${selectedBrand === 'Balaji Garments' ? 'text-indigo-100' : 'text-slate-500'}`}>
              Premium Shirts (₹450–₹550) • Formal/Casual
            </p>
          </button>

          {/* Carvel Brand */}
          <button
            onClick={() => handleBrandSelect('Carvel')}
            className={`p-4 rounded-xl border text-left transition relative ${
              selectedBrand === 'Carvel'
                ? 'bg-rose-700 text-white border-rose-700 shadow-md ring-2 ring-rose-700/20'
                : 'bg-rose-50/50 text-slate-800 border-rose-100 hover:bg-rose-50 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-base">Carvel</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedBrand === 'Carvel' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'}`}>
                {carvelCount || 8} items
              </span>
            </div>
            <p className={`text-xs mt-1 line-clamp-1 ${selectedBrand === 'Carvel' ? 'text-rose-100' : 'text-slate-500'}`}>
              Girls' (Bras/Chemises) • Boys' Innerwear
            </p>
          </button>

        </div>

        {/* Dynamic Category Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Categories:</span>
          {getCategoriesForBrand().map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All' ? 'all' : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                (selectedCategory === 'all' && cat === 'All') || selectedCategory === cat
                  ? 'bg-textile-teal text-white shadow-sm font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER, SEARCH & SORT BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search product name or SKU code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
            />
          </form>

          {/* Size Filter */}
          <div>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-textile-teal"
            >
              <option value="all">All Sizes (38, 40, 42, 44, etc.)</option>
              <option value="38">Size 38</option>
              <option value="40">Size 40</option>
              <option value="42">Size 42</option>
              <option value="44">Size 44</option>
              <option value="8 Mulam">8 Mulam (Dhoti)</option>
              <option value="4 Mulam">4 Mulam (Dhoti)</option>
              <option value="32">Size 32 (Innerwear)</option>
              <option value="34">Size 34 (Innerwear)</option>
              <option value="S">Size S / 80cm</option>
              <option value="M">Size M / 85cm</option>
              <option value="L">Size L / 90cm</option>
              <option value="XL">Size XL / 95cm</option>
            </select>
          </div>

          {/* Colour Filter */}
          <div>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-textile-teal"
            >
              <option value="all">All Colours & Patterns</option>
              <option value="Blue">Blue / Sky Blue</option>
              <option value="White">White / Off-White</option>
              <option value="Pink">Pink</option>
              <option value="Brown">Brown</option>
              <option value="Checked">Checked</option>
              <option value="Copper">Copper</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Beige">Beige / Skin</option>
              <option value="Grey">Grey / Melange</option>
              <option value="Charcoal">Charcoal</option>
            </select>
          </div>

          {/* Sort By Price */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-textile-teal"
            >
              <option value="name_asc">Sort: Name (A-Z)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="stock_desc">Stock: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* CATALOG DISPLAY: CARD PRESENTATION VIEW */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((p) => {
            const imgUrl = p.image || getProductImage(p.category, p.code, p.brand);
            const brandBadgeColor =
              p.brand === 'RPK' ? 'bg-teal-700 text-white' :
              p.brand === 'Balaji Garments' ? 'bg-indigo-700 text-white' :
              'bg-rose-700 text-white';

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image Container */}
                  <div
                    className="relative h-60 bg-slate-100 overflow-hidden cursor-pointer"
                    onClick={() => setDetailsModalProduct(p)}
                  >
                    <img
                      src={imgUrl}
                      alt={p.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Brand Pill */}
                    <span className={`absolute top-3 left-3 text-xs font-black uppercase px-2.5 py-1 rounded-lg shadow-sm ${brandBadgeColor}`}>
                      {p.brand}
                    </span>

                    {/* Stock Status Pill */}
                    <span className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm ${
                      p.currentStock === 0 ? 'bg-red-600 text-white' :
                      p.currentStock <= p.minStockThreshold ? 'bg-amber-500 text-white' :
                      'bg-emerald-600 text-white'
                    }`}>
                      {p.stockStatus || (p.currentStock === 0 ? 'Out of Stock' : p.currentStock <= p.minStockThreshold ? 'Low Stock' : 'In Stock')}
                    </span>

                    {/* Hover Quick View */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow flex items-center space-x-1.5">
                        <Eye className="w-3.5 h-3.5 text-textile-teal" />
                        <span>View Details</span>
                      </span>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{p.code}</span>
                      <span className="text-slate-600 font-semibold">{p.category}</span>
                    </div>

                    <h3
                      onClick={() => setDetailsModalProduct(p)}
                      className="font-bold text-slate-900 text-base leading-snug line-clamp-1 hover:text-textile-teal cursor-pointer transition"
                    >
                      {p.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.description || 'Quality textile garment crafted for professional retail presentation.'}
                    </p>

                    {/* Sizes and Colours */}
                    <div className="pt-1.5 space-y-1 text-xs">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <span className="text-[11px] text-slate-400 font-medium">Sizes:</span>
                        <span className="font-semibold text-slate-800">{p.size}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-600">
                        <span className="text-[11px] text-slate-400 font-medium">Colour:</span>
                        <span className="font-semibold text-slate-800">{p.color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price, Actions & Order Now Button */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-black text-slate-900">₹{p.price}</div>
                      <div className="text-[11px] text-slate-500">
                        Available Stock: <strong className="text-slate-900">{p.currentStock}</strong> pcs
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setStockModalProduct(p);
                          setQuickStockQty(10);
                          setQuickStockType('ADD');
                        }}
                        className="p-2 text-slate-600 hover:text-textile-teal hover:bg-white rounded-lg transition"
                        title="Quick Stock Update"
                      >
                        <Boxes className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 text-slate-600 hover:text-sky-600 hover:bg-white rounded-lg transition"
                        title="Edit Product & Image"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sample "Order Now" Button for Demonstration */}
                  <button
                    type="button"
                    onClick={() => setSampleOrderProduct(p)}
                    className="w-full py-2 px-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center space-x-1.5 group/btn cursor-pointer"
                    title="Order Now (Sample UI Demonstration)"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                    <span>Order Now</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">SKU / Code</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Sizes</th>
                  <th className="py-3 px-4">Colour</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-4">
                      <img
                        src={p.image || getProductImage(p.category, p.code, p.brand)}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.brand === 'RPK' ? 'bg-teal-100 text-teal-800' :
                        p.brand === 'Balaji Garments' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.brand}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-xs">{p.size}</td>
                    <td className="py-3 px-4 text-slate-600">{p.color}</td>
                    <td className="py-3 px-4 font-black text-slate-900">₹{p.price}</td>
                    <td className="py-3 px-4 text-center font-bold">{p.currentStock} pcs</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.currentStock === 0 ? 'bg-red-100 text-red-800' :
                        p.currentStock <= p.minStockThreshold ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stockStatus || (p.currentStock === 0 ? 'Out of Stock' : p.currentStock <= p.minStockThreshold ? 'Low Stock' : 'In Stock')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSampleOrderProduct(p)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-textile-teal hover:bg-teal-700 rounded-lg inline-flex items-center space-x-1 shadow-2xs mr-1"
                        title="Order Now (Demonstration Sample)"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Order Now</span>
                      </button>
                      <button
                        onClick={() => {
                          setStockModalProduct(p);
                          setQuickStockQty(10);
                          setQuickStockType('ADD');
                        }}
                        className="p-1.5 text-slate-500 hover:text-textile-teal"
                        title="Stock"
                      >
                        <Boxes className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-slate-500 hover:text-sky-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="p-1.5 text-slate-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {displayedProducts.length === 0 && !loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Shirt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No products match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filters or add a new textile product.</p>
        </div>
      )}

      {/* PRODUCT DETAILS MODAL (FOR SALES CALLS & CUSTOMER SHOWCASE) */}
      {detailsModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailsModalProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="sm:w-1/2 h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={detailsModalProduct.image || getProductImage(detailsModalProduct.category, detailsModalProduct.code, detailsModalProduct.brand)}
                  alt={detailsModalProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:w-1/2 space-y-3">
                <div>
                  <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded ${
                    detailsModalProduct.brand === 'RPK' ? 'bg-teal-100 text-teal-800' :
                    detailsModalProduct.brand === 'Balaji Garments' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {detailsModalProduct.brand}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1.5">{detailsModalProduct.name}</h2>
                  <div className="text-xs font-mono text-slate-400">{detailsModalProduct.code}</div>
                </div>

                <div className="text-2xl font-black text-slate-900">
                  ₹{detailsModalProduct.price}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-100 py-3">
                  <div><strong>Category:</strong> {detailsModalProduct.category}</div>
                  <div><strong>Available Sizes:</strong> {detailsModalProduct.size}</div>
                  <div><strong>Available Colour:</strong> {detailsModalProduct.color}</div>
                  <div>
                    <strong>Warehouse Stock:</strong> {detailsModalProduct.currentStock} units
                    ({detailsModalProduct.currentStock > detailsModalProduct.minStockThreshold ? 'In Stock' : 'Low Stock'})
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {detailsModalProduct.description || 'Authentic manufacturer guaranteed quality.'}
                </p>

                <div className="pt-2 flex space-x-2">
                  <button
                    onClick={() => {
                      const p = detailsModalProduct;
                      setDetailsModalProduct(null);
                      handleOpenEdit(p);
                    }}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Product</span>
                  </button>
                  <button
                    onClick={() => {
                      const p = detailsModalProduct;
                      setDetailsModalProduct(null);
                      setStockModalProduct(p);
                    }}
                    className="flex-1 py-2 bg-textile-teal hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Update Stock</span>
                  </button>
                </div>

                {/* Sample Order Now Action */}
                <button
                  type="button"
                  onClick={() => {
                    const p = detailsModalProduct;
                    setDetailsModalProduct(null);
                    setSampleOrderProduct(p);
                  }}
                  className="w-full mt-2.5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order Now (Sample Demonstration)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK STOCK ADJUSTMENT MODAL */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setStockModalProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 mb-1">Update Stock Quantity</h2>
            <p className="text-xs text-slate-500 mb-4">
              {stockModalProduct.name} ({stockModalProduct.code}) • Current: <strong className="text-slate-800">{stockModalProduct.currentStock} pcs</strong>
            </p>

            <form onSubmit={handleQuickStockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setQuickStockType('ADD'); setQuickStockReason('Shipment received from manufacturer'); }}
                    className={`py-2 text-xs font-bold rounded-xl border text-center transition ${
                      quickStockType === 'ADD' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    + Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => { setQuickStockType('REDUCE'); setQuickStockReason('Defective / Shop sample removal'); }}
                    className={`py-2 text-xs font-bold rounded-xl border text-center transition ${
                      quickStockType === 'REDUCE' ? 'bg-red-600 text-white border-red-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    - Reduce Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => { setQuickStockType('ADJUSTMENT'); setQuickStockReason('Warehouse audit reconciliation'); }}
                    className={`py-2 text-xs font-bold rounded-xl border text-center transition ${
                      quickStockType === 'ADJUSTMENT' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {quickStockType === 'ADD' ? 'Quantity to Add (pcs)' :
                   quickStockType === 'REDUCE' ? 'Quantity to Reduce (pcs)' : 'Exact Quantity (pcs)'}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={quickStockQty}
                  onChange={(e) => setQuickStockQty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  required
                  value={quickStockReason}
                  onChange={(e) => setQuickStockReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStockModalProduct(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-textile-teal text-white rounded-xl text-xs font-semibold hover:bg-teal-700 shadow"
                >
                  Confirm Stock Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL (WITH REALISTIC IMAGE UPLOAD & PRESET PICKER) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {editingProduct ? 'Edit Textile Product' : 'Add New Textile Product'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter product details, pricing, stock levels, and realistic photography.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Code & Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Code / SKU *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    placeholder="e.g. RPK-SHR-06"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-textile-teal disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => {
                      const b = e.target.value;
                      const cat = b === 'RPK' ? 'Shirts' : b === 'Balaji Garments' ? 'Premium Shirts' : "Girls' Innerwear";
                      const pr = b === 'Balaji Garments' ? 480 : b === 'RPK' ? 240 : 180;
                      setFormData({ ...formData, brand: b, category: cat, price: pr });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  >
                    <option value="RPK">RPK</option>
                    <option value="Balaji Garments">Balaji Garments</option>
                    <option value="Carvel">Carvel</option>
                  </select>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RPK Classic Sky Blue Cotton Shirt"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              {/* Category, Size, Color */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  >
                    {formData.brand === 'RPK' && (
                      <>
                        <option value="Shirts">Shirts</option>
                        <option value="Dhoti and Shirt Set">Dhoti and Shirt Set</option>
                        <option value="Dhoti">Dhoti</option>
                      </>
                    )}
                    {formData.brand === 'Balaji Garments' && (
                      <option value="Premium Shirts">Premium Shirts</option>
                    )}
                    {formData.brand === 'Carvel' && (
                      <>
                        <option value="Girls' Innerwear">Girls' Innerwear</option>
                        <option value="Boys' Innerwear">Boys' Innerwear</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Sizes *</label>
                  <input
                    type="text"
                    required
                    placeholder="38, 40, 42, 44"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Colour *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Blue"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  />
                </div>
              </div>

              {/* Price, Stock, Threshold */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {formData.brand === 'RPK' && formData.category === 'Shirts' ? 'Target: ₹200–₹300' :
                     formData.brand === 'RPK' && formData.category === 'Dhoti and Shirt Set' ? 'Target: ₹550–₹700' :
                     formData.brand === 'Balaji Garments' ? 'Target: ₹450–₹550' : 'Enter price'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    disabled={!!editingProduct}
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min Alert Level *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.minStockThreshold}
                    onChange={(e) => setFormData({ ...formData, minStockThreshold: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                  />
                </div>
              </div>

              {/* REALISTIC PRODUCT PHOTOGRAPH UPLOAD & PRESET SECTION */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5 text-textile-teal" />
                    <span>Realistic Product Photograph</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Upload or Pick from Preset Gallery</span>
                </div>

                {/* Preview Thumbnail */}
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={formData.image || '/assets/products/rpk-shirt-blue.jpg'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Image URL or Path (/assets/products/...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-textile-teal"
                    />

                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-semibold transition">
                        <span>{uploadingImage ? 'Uploading...' : '📁 Upload File from Computer'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Quick Verified Product Photos:</div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {PRODUCT_IMAGE_PRESETS.filter(item => !formData.brand || item.brand === formData.brand).map((pItem) => (
                      <button
                        key={pItem.path}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: pItem.path })}
                        className={`text-[10px] px-2 py-1 rounded border transition ${
                          formData.image === pItem.path
                            ? 'bg-textile-teal text-white border-textile-teal font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Description / Garment Specs</label>
                <textarea
                  rows="2"
                  placeholder="Fabric weave, finish, care instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-textile-teal"
                />
              </div>

              {/* Actions */}
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
                  className="px-5 py-2 bg-textile-teal text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SAMPLE "ORDER NOW" PREVIEW MODAL (DEMONSTRATION ONLY) */}
      {sampleOrderProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setSampleOrderProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-textile-teal shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Demonstration Sample UI
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-0.5">Order Now (Sample)</h2>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-4">
              <div className="font-bold text-slate-900 text-sm">{sampleOrderProduct.name}</div>
              <div className="text-slate-500 font-mono text-[11px]">{sampleOrderProduct.code} • Brand: {sampleOrderProduct.brand}</div>
              <div className="flex justify-between pt-1 text-slate-700">
                <span>Wholesale Unit Price:</span>
                <strong className="text-slate-900 font-bold">₹{sampleOrderProduct.price}</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Available Warehouse Stock:</span>
                <span className="font-semibold text-slate-800">{sampleOrderProduct.currentStock} pcs</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-teal-950 text-xs mb-5 space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-textile-teal">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Future Enhancement Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed text-teal-900">
                This "Order Now" button is a visual sample UI element for project demonstration. In future development, it will connect directly with textile supplier APIs and automated mill purchase order workflows.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSampleOrderProduct(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition text-center cursor-pointer shadow-sm"
            >
              Close Sample Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
