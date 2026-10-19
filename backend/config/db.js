const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed data for brands
const INITIAL_BRANDS = [
  { id: 'BRD-001', name: 'RPK', code: 'RPK', contact: '+91 94432 10101', description: 'Men\'s everyday shirts, traditional dhoti-and-shirt festive sets, and pure cotton dhotis.', status: 'Active' },
  { id: 'BRD-002', name: 'Balaji Garments', code: 'BG', contact: '+91 98421 20202', description: 'Premium-quality executive, formal, casual, plain, and checked shirts (₹450 - ₹550).', status: 'Active' },
  { id: 'BRD-003', name: 'Carvel', code: 'CRV', contact: '+91 97500 30303', description: 'Specialized innerwear for girls (bras, chemises) and boys (camisoles, singlets).', status: 'Active' }
];

// Initial seed data for products
const INITIAL_PRODUCTS = [
  // RPK Shirts
  { id: 'PRD-001', code: 'RPK-SHR-01', name: 'RPK Classic Sky Blue Cotton Shirt', brand: 'RPK', category: 'Shirts', size: '38, 40, 42, 44', color: 'Sky Blue', price: 240, currentStock: 45, minStockThreshold: 15, image: '/assets/products/rpk-shirt-blue.jpg', description: 'Breathable combed cotton everyday shirt with classic spread collar and patch pocket.' },
  { id: 'PRD-002', code: 'RPK-SHR-02', name: 'RPK Pure White Twill Formal Shirt', brand: 'RPK', category: 'Shirts', size: '38, 40, 42, 44', color: 'White', price: 250, currentStock: 50, minStockThreshold: 20, image: '/assets/products/rpk-shirt-white.jpg', description: 'Pristine white everyday formal shirt crafted from durable 100% woven cotton.' },
  { id: 'PRD-003', code: 'RPK-SHR-03', name: 'RPK Soft Pastel Pink Casual Shirt', brand: 'RPK', category: 'Shirts', size: '38, 40, 42, 44', color: 'Pink', price: 260, currentStock: 30, minStockThreshold: 10, image: '/assets/products/rpk-shirt-pink.jpg', description: 'Comfortable pastel pink cotton casual shirt suitable for daily retail display.' },
  { id: 'PRD-004', code: 'RPK-SHR-04', name: 'RPK Earth Brown Daily Wear Shirt', brand: 'RPK', category: 'Shirts', size: '38, 40, 42, 44', color: 'Brown', price: 270, currentStock: 25, minStockThreshold: 10, image: '/assets/products/rpk-shirt-brown.jpg', description: 'Rich earth-toned everyday casual shirt with durable double-stitched seams.' },
  { id: 'PRD-005', code: 'RPK-SHR-05', name: 'RPK Classic Navy-Red Checked Shirt', brand: 'RPK', category: 'Shirts', size: '38, 40, 42, 44', color: 'Checked', price: 290, currentStock: 35, minStockThreshold: 15, image: '/assets/products/rpk-shirt-checked.jpg', description: 'Popular retail grid check pattern woven from pre-shrunk cotton yarn.' },

  // RPK Dhoti & Shirt Sets
  { id: 'PRD-006', code: 'RPK-SET-01', name: 'RPK Copper Zari Dhoti & Shirt Set', brand: 'RPK', category: 'Dhoti and Shirt Set', size: '38, 40, 42, 44', color: 'Copper', price: 580, currentStock: 25, minStockThreshold: 10, image: '/assets/products/rpk-set-copper.jpg', description: 'Complete wedding combination set: traditional 8-Mulam dhoti with rich copper zari border and coordinated cream shirt.' },
  { id: 'PRD-007', code: 'RPK-SET-02', name: 'RPK Silver Border Dhoti & Shirt Set', brand: 'RPK', category: 'Dhoti and Shirt Set', size: '38, 40, 42, 44', color: 'Silver', price: 620, currentStock: 20, minStockThreshold: 10, image: '/assets/products/rpk-set-silver.jpg', description: 'Complete festive ceremony set featuring an authentic silver zari dhoti and matching silk-cotton shirt.' },
  { id: 'PRD-008', code: 'RPK-SET-03', name: 'RPK Pink Copper Festive Dhoti & Shirt Set', brand: 'RPK', category: 'Dhoti and Shirt Set', size: '38, 40, 42, 44', color: 'Pink Copper', price: 660, currentStock: 18, minStockThreshold: 8, image: '/assets/products/rpk-set-pink-copper.jpg', description: 'Grand reception combination with intricate pink-copper zari woven border dhoti and coordinated shirt.' },
  { id: 'PRD-009', code: 'RPK-SET-04', name: 'RPK Gold Copper Traditional Dhoti & Shirt Set', brand: 'RPK', category: 'Dhoti and Shirt Set', size: '38, 40, 42, 44', color: 'Gold Copper', price: 690, currentStock: 22, minStockThreshold: 8, image: '/assets/products/rpk-set-gold-copper.jpg', description: 'Grand temple wedding combination set displaying dual gold-copper zari border dhoti paired with festive shirt.' },

  // RPK Individual Dhotis
  { id: 'PRD-010', code: 'RPK-DHT-01', name: 'RPK Traditional Gold Zari Cotton Dhoti (8 Mulam)', brand: 'RPK', category: 'Dhoti', size: '8 Mulam (3.6m)', color: 'Cream / Gold Zari', price: 320, currentStock: 50, minStockThreshold: 20, image: '/assets/products/rpk-dhoti-gold.jpg', description: 'Authentic 100% fine combed cotton men\'s dhoti with 1.5-inch authentic gold zari border.' },
  { id: 'PRD-011', code: 'RPK-DHT-02', name: 'RPK Pure White Temple Cotton Dhoti (4 Mulam)', brand: 'RPK', category: 'Dhoti', size: '4 Mulam (1.8m)', color: 'Pure White', price: 240, currentStock: 60, minStockThreshold: 25, image: '/assets/products/rpk-dhoti-white.jpg', description: 'Soft woven single dhoti with woven green selvage border, ideal for daily prayer and comfort wear.' },
  { id: 'PRD-012', code: 'RPK-DHT-03', name: 'RPK Silver Zari Wedding Silk-Cotton Dhoti', brand: 'RPK', category: 'Dhoti', size: '8 Mulam (3.6m)', color: 'Silver / Off-White', price: 360, currentStock: 30, minStockThreshold: 12, image: '/assets/products/rpk-dhoti-silver.jpg', description: 'High-count silk cotton blend double dhoti featuring an elegant silver zari border.' },

  // Balaji Garments Premium Shirts
  { id: 'PRD-013', code: 'BG-SHR-01', name: 'Balaji Royal Executive Cotton Formal Shirt', brand: 'Balaji Garments', category: 'Premium Shirts', size: '38, 40, 42, 44', color: 'Royal Blue', price: 480, currentStock: 35, minStockThreshold: 15, image: '/assets/products/bg-shirt-royal-blue.jpg', description: '80s count Egyptian giza cotton executive formal shirt with French placket and pearlized buttons.' },
  { id: 'PRD-014', code: 'BG-SHR-02', name: 'Balaji Crisp Charcoal Premium Twill Shirt', brand: 'Balaji Garments', category: 'Premium Shirts', size: '38, 40, 42, 44', color: 'Charcoal Grey', price: 495, currentStock: 28, minStockThreshold: 10, image: '/assets/products/bg-shirt-charcoal.jpg', description: 'Wrinkle-resistant luxury twill cotton shirt crafted for executive business meetings.' },
  { id: 'PRD-015', code: 'BG-SHR-03', name: 'Balaji Solid Pastel Blue Premium Shirt', brand: 'Balaji Garments', category: 'Premium Shirts', size: '38, 40, 42, 44', color: 'Pastel Blue', price: 510, currentStock: 32, minStockThreshold: 12, image: '/assets/products/bg-shirt-pastel-blue.jpg', description: 'High-density combed cotton with sharp cutaway collar and breathable luxury summer weave.' },
  { id: 'PRD-016', code: 'BG-SHR-04', name: 'Balaji Pure White Luxury Satin-Finish Shirt', brand: 'Balaji Garments', category: 'Premium Shirts', size: '38, 40, 42, 44', color: 'Pure White', price: 530, currentStock: 40, minStockThreshold: 15, image: '/assets/products/bg-shirt-white-luxury.jpg', description: 'Impeccably tailored pristine white luxury shirt with double-fused spread collar.' },
  { id: 'PRD-017', code: 'BG-SHR-05', name: 'Balaji Micro-Grid Checked Premium Shirt', brand: 'Balaji Garments', category: 'Premium Shirts', size: '38, 40, 42, 44', color: 'Checked', price: 540, currentStock: 20, minStockThreshold: 10, image: '/assets/products/bg-shirt-checked-premium.jpg', description: 'Refined business micro-grid check pattern woven from yarn-dyed long-staple cotton.' },
  { id: 'PRD-018', code: 'BG-SHR-06', name: 'Balaji Oxford Weave Casual Premium Shirt', brand: 'Balaji Garments', category: 'Premium Shirts', size: '38, 40, 42, 44', color: 'Olive Green', price: 470, currentStock: 25, minStockThreshold: 10, image: '/assets/products/bg-shirt-oxford-olive.jpg', description: 'Washed heavyweight Oxford cotton casual shirt featuring a durable button-down collar.' },

  // Carvel Innerwear
  { id: 'PRD-019', code: 'CRV-BRA-01', name: 'Carvel Girls Daily Comfort Cotton Bra', brand: 'Carvel', category: 'Girls\' Innerwear', size: '30, 32, 34, 36', color: 'White', price: 180, currentStock: 60, minStockThreshold: 25, image: '/assets/products/carvel-bra-comfort.jpg', description: '100% breathable combed cotton non-padded wireless everyday support bra with soft elastic bands.' },
  { id: 'PRD-020', code: 'CRV-BRA-02', name: 'Carvel Seamless Everyday Support Bra', brand: 'Carvel', category: 'Girls\' Innerwear', size: '32, 34, 36, 38', color: 'Beige / Skin', price: 220, currentStock: 45, minStockThreshold: 20, image: '/assets/products/carvel-bra-seamless.jpg', description: 'Smooth molded non-wired T-shirt bra designed for invisible daily wear under school uniforms and kurtas.' },
  { id: 'PRD-021', code: 'CRV-CHM-01', name: 'Carvel Pure Cotton Full Slip Chemise', brand: 'Carvel', category: 'Girls\' Innerwear', size: 'S, M, L, XL', color: 'White', price: 195, currentStock: 50, minStockThreshold: 20, image: '/assets/products/carvel-chemise-white.jpg', description: 'Full-length pure cotton modest chemise slip for under-saree and under-dress everyday comfort.' },
  { id: 'PRD-022', code: 'CRV-CHM-02', name: 'Carvel Spaghetti Strap Cotton Chemise', brand: 'Carvel', category: 'Girls\' Innerwear', size: 'S, M, L, XL', color: 'Pastel Pink', price: 210, currentStock: 35, minStockThreshold: 15, image: '/assets/products/carvel-chemise-pink.jpg', description: 'Soft stretch rib cotton slip with adjustable spaghetti shoulder straps and neat lace trim.' },
  { id: 'PRD-023', code: 'CRV-CAM-01', name: 'Carvel Boys 100% Combed Cotton Ribbed Camisole / Vest', brand: 'Carvel', category: 'Boys\' Innerwear', size: '75cm, 80cm, 85cm, 90cm', color: 'White', price: 130, currentStock: 80, minStockThreshold: 30, image: '/assets/products/carvel-camisole-ribbed.jpg', description: 'Ultra-absorbent 1x1 ribbed combed cotton sleeveless vest with reinforced neck binding for boys.' },
  { id: 'PRD-024', code: 'CRV-CAM-02', name: 'Carvel Classic Soft Undershirt Camisole', brand: 'Carvel', category: 'Boys\' Innerwear', size: '80cm, 85cm, 90cm, 95cm', color: 'White', price: 145, currentStock: 70, minStockThreshold: 25, image: '/assets/products/carvel-camisole-white.jpg', description: 'Tagless comfort daily school undershirt camisole made from sweat-wicking fine combed cotton.' },
  { id: 'PRD-025', code: 'CRV-SNG-01', name: 'Carvel Boys Breathable Athletic Singlet', brand: 'Carvel', category: 'Boys\' Innerwear', size: 'S, M, L, XL', color: 'Grey Melange', price: 160, currentStock: 40, minStockThreshold: 15, image: '/assets/products/carvel-singlet-grey.jpg', description: 'Deep-cut armhole sporty athletic cotton singlet designed for active boys and sports wear.' },
  { id: 'PRD-026', code: 'CRV-SNG-02', name: 'Carvel Active Fit Cotton Gym Singlet', brand: 'Carvel', category: 'Boys\' Innerwear', size: 'S, M, L, XL', color: 'Charcoal', price: 175, currentStock: 35, minStockThreshold: 15, image: '/assets/products/carvel-singlet-charcoal.jpg', description: 'Breathable combed cotton athletic singlet offering unrestricted movement and maximum comfort.' }
];

// Local JSON Store Manager
class LocalStore {
  constructor() {
    this.files = {
      brands: path.join(dataDir, 'brands.json'),
      products: path.join(dataDir, 'products.json'),
      sales: path.join(dataDir, 'sales.json'),
      inventoryTransactions: path.join(dataDir, 'inventory_transactions.json')
    };
    this.initStore();
  }

  initStore() {
    if (!fs.existsSync(this.files.brands)) {
      this.write('brands', INITIAL_BRANDS);
    }
    if (!fs.existsSync(this.files.products)) {
      this.write('products', INITIAL_PRODUCTS);
    }
    if (!fs.existsSync(this.files.sales)) {
      this.write('sales', []);
    }
    if (!fs.existsSync(this.files.inventoryTransactions)) {
      const initialLogs = INITIAL_PRODUCTS.map(p => ({
        id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        productId: p.id,
        productCode: p.code,
        productName: p.name,
        brand: p.brand,
        type: 'INITIAL_STOCK',
        quantity: p.currentStock,
        previousStock: 0,
        newStock: p.currentStock,
        date: new Date().toISOString().split('T')[0],
        reason: 'Initial system inventory stock count'
      }));
      this.write('inventoryTransactions', initialLogs);
    }
  }

  read(key) {
    try {
      const filePath = this.files[key];
      if (!fs.existsSync(filePath)) return [];
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      console.error(`Error reading ${key}:`, err.message);
      return [];
    }
  }

  write(key, data) {
    try {
      const filePath = this.files[key];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error(`Error writing ${key}:`, err.message);
      return false;
    }
  }
}

const localStore = new LocalStore();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jp_agencies_textile';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully to ${uri}`);
  } catch (err) {
    isMongoConnected = false;
    console.log(`[Database Notice] MongoDB server is not running locally. Operating in Local Persistent JSON Store mode.`);
    console.log(`[Database Notice] All data will be saved safely to disk at: ${dataDir}`);
    console.log(`[Database Notice] You can connect to MongoDB or MongoDB Atlas anytime by setting MONGODB_URI in backend/.env`);
  }
};

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  localStore
};
