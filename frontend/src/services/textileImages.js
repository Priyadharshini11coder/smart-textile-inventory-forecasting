// Realistic Product Image Helper for RPK, Balaji Garments, and Carvel

export const PRODUCT_IMAGE_PRESETS = [
  // RPK Shirts
  { label: 'RPK Blue Shirt', path: '/assets/products/rpk-shirt-blue.jpg', brand: 'RPK', category: 'Shirts' },
  { label: 'RPK White Shirt', path: '/assets/products/rpk-shirt-white.jpg', brand: 'RPK', category: 'Shirts' },
  { label: 'RPK Pink Shirt', path: '/assets/products/rpk-shirt-pink.jpg', brand: 'RPK', category: 'Shirts' },
  { label: 'RPK Brown Shirt', path: '/assets/products/rpk-shirt-brown.jpg', brand: 'RPK', category: 'Shirts' },
  { label: 'RPK Checked Shirt', path: '/assets/products/rpk-shirt-checked.jpg', brand: 'RPK', category: 'Shirts' },

  // RPK Dhoti & Shirt Sets
  { label: 'RPK Copper Dhoti-Shirt Set', path: '/assets/products/rpk-set-copper.jpg', brand: 'RPK', category: 'Dhoti and Shirt Set' },
  { label: 'RPK Silver Dhoti-Shirt Set', path: '/assets/products/rpk-set-silver.jpg', brand: 'RPK', category: 'Dhoti and Shirt Set' },
  { label: 'RPK Pink Copper Dhoti-Shirt Set', path: '/assets/products/rpk-set-pink-copper.jpg', brand: 'RPK', category: 'Dhoti and Shirt Set' },
  { label: 'RPK Gold Copper Dhoti-Shirt Set', path: '/assets/products/rpk-set-gold-copper.jpg', brand: 'RPK', category: 'Dhoti and Shirt Set' },

  // RPK Individual Dhotis
  { label: 'RPK Gold Zari Dhoti', path: '/assets/products/rpk-dhoti-gold.jpg', brand: 'RPK', category: 'Dhoti' },
  { label: 'RPK White Temple Dhoti', path: '/assets/products/rpk-dhoti-white.jpg', brand: 'RPK', category: 'Dhoti' },
  { label: 'RPK Silver Zari Dhoti', path: '/assets/products/rpk-dhoti-silver.jpg', brand: 'RPK', category: 'Dhoti' },

  // Balaji Garments Premium Shirts
  { label: 'Balaji Royal Blue Formal Shirt', path: '/assets/products/bg-shirt-royal-blue.jpg', brand: 'Balaji Garments', category: 'Premium Shirts' },
  { label: 'Balaji Charcoal Executive Twill Shirt', path: '/assets/products/bg-shirt-charcoal.jpg', brand: 'Balaji Garments', category: 'Premium Shirts' },
  { label: 'Balaji Pastel Blue Premium Shirt', path: '/assets/products/bg-shirt-pastel-blue.jpg', brand: 'Balaji Garments', category: 'Premium Shirts' },
  { label: 'Balaji Pure White Luxury Satin Shirt', path: '/assets/products/bg-shirt-white-luxury.jpg', brand: 'Balaji Garments', category: 'Premium Shirts' },
  { label: 'Balaji Micro-Grid Checked Shirt', path: '/assets/products/bg-shirt-checked-premium.jpg', brand: 'Balaji Garments', category: 'Premium Shirts' },
  { label: 'Balaji Oxford Casual Olive Shirt', path: '/assets/products/bg-shirt-oxford-olive.jpg', brand: 'Balaji Garments', category: 'Premium Shirts' },

  // Carvel Girls Innerwear
  { label: 'Carvel Girls Comfort Cotton Bra', path: '/assets/products/carvel-bra-comfort.jpg', brand: 'Carvel', category: "Girls' Innerwear" },
  { label: 'Carvel Seamless Everyday Bra', path: '/assets/products/carvel-bra-seamless.jpg', brand: 'Carvel', category: "Girls' Innerwear" },
  { label: 'Carvel Pure Cotton Slip Chemise', path: '/assets/products/carvel-chemise-white.jpg', brand: 'Carvel', category: "Girls' Innerwear" },
  { label: 'Carvel Spaghetti Strap Cotton Chemise', path: '/assets/products/carvel-chemise-pink.jpg', brand: 'Carvel', category: "Girls' Innerwear" },

  // Carvel Boys Innerwear
  { label: 'Carvel Boys Ribbed Cotton Camisole/Vest', path: '/assets/products/carvel-camisole-ribbed.jpg', brand: 'Carvel', category: "Boys' Innerwear" },
  { label: 'Carvel Classic Undershirt Camisole', path: '/assets/products/carvel-camisole-white.jpg', brand: 'Carvel', category: "Boys' Innerwear" },
  { label: 'Carvel Boys Athletic Singlet', path: '/assets/products/carvel-singlet-grey.jpg', brand: 'Carvel', category: "Boys' Innerwear" },
  { label: 'Carvel Active Fit Cotton Gym Singlet', path: '/assets/products/carvel-singlet-charcoal.jpg', brand: 'Carvel', category: "Boys' Innerwear" }
];

export const getProductImage = (category = '', code = '', brand = '') => {
  const c = (code || '').toUpperCase();
  const cat = (category || '').toLowerCase();
  const b = (brand || '').toLowerCase();

  // 1. Direct code lookups
  if (c.includes('RPK-SHR-01')) return '/assets/products/rpk-shirt-blue.jpg';
  if (c.includes('RPK-SHR-02')) return '/assets/products/rpk-shirt-white.jpg';
  if (c.includes('RPK-SHR-03')) return '/assets/products/rpk-shirt-pink.jpg';
  if (c.includes('RPK-SHR-04')) return '/assets/products/rpk-shirt-brown.jpg';
  if (c.includes('RPK-SHR-05')) return '/assets/products/rpk-shirt-checked.jpg';

  if (c.includes('RPK-SET-01')) return '/assets/products/rpk-set-copper.jpg';
  if (c.includes('RPK-SET-02')) return '/assets/products/rpk-set-silver.jpg';
  if (c.includes('RPK-SET-03')) return '/assets/products/rpk-set-pink-copper.jpg';
  if (c.includes('RPK-SET-04')) return '/assets/products/rpk-set-gold-copper.jpg';

  if (c.includes('RPK-DHT-01')) return '/assets/products/rpk-dhoti-gold.jpg';
  if (c.includes('RPK-DHT-02')) return '/assets/products/rpk-dhoti-white.jpg';
  if (c.includes('RPK-DHT-03')) return '/assets/products/rpk-dhoti-silver.jpg';

  if (c.includes('BG-SHR-01')) return '/assets/products/bg-shirt-royal-blue.jpg';
  if (c.includes('BG-SHR-02')) return '/assets/products/bg-shirt-charcoal.jpg';
  if (c.includes('BG-SHR-03')) return '/assets/products/bg-shirt-pastel-blue.jpg';
  if (c.includes('BG-SHR-04')) return '/assets/products/bg-shirt-white-luxury.jpg';
  if (c.includes('BG-SHR-05')) return '/assets/products/bg-shirt-checked-premium.jpg';
  if (c.includes('BG-SHR-06')) return '/assets/products/bg-shirt-oxford-olive.jpg';

  if (c.includes('CRV-BRA-01')) return '/assets/products/carvel-bra-comfort.jpg';
  if (c.includes('CRV-BRA-02')) return '/assets/products/carvel-bra-seamless.jpg';
  if (c.includes('CRV-CHM-01')) return '/assets/products/carvel-chemise-white.jpg';
  if (c.includes('CRV-CHM-02')) return '/assets/products/carvel-chemise-pink.jpg';

  if (c.includes('CRV-CAM-01')) return '/assets/products/carvel-camisole-ribbed.jpg';
  if (c.includes('CRV-CAM-02')) return '/assets/products/carvel-camisole-white.jpg';
  if (c.includes('CRV-SNG-01')) return '/assets/products/carvel-singlet-grey.jpg';
  if (c.includes('CRV-SNG-02')) return '/assets/products/carvel-singlet-charcoal.jpg';

  // 2. Category / Brand lookups
  if (cat.includes('dhoti and shirt') || cat.includes('set')) {
    return '/assets/products/rpk-set-copper.jpg';
  }
  if (cat.includes('dhoti')) {
    return '/assets/products/rpk-dhoti-gold.jpg';
  }
  if (cat.includes('bra')) {
    return '/assets/products/carvel-bra-comfort.jpg';
  }
  if (cat.includes('chemise')) {
    return '/assets/products/carvel-chemise-white.jpg';
  }
  if (cat.includes('singlet')) {
    return '/assets/products/carvel-singlet-grey.jpg';
  }
  if (cat.includes('camisole') || cat.includes('vest')) {
    return '/assets/products/carvel-camisole-ribbed.jpg';
  }
  if (cat.includes('girl')) {
    return '/assets/products/carvel-bra-comfort.jpg';
  }
  if (cat.includes('boy')) {
    return '/assets/products/carvel-camisole-ribbed.jpg';
  }
  if (b.includes('balaji') || cat.includes('premium')) {
    return '/assets/products/bg-shirt-royal-blue.jpg';
  }
  return '/assets/products/rpk-shirt-blue.jpg';
};
