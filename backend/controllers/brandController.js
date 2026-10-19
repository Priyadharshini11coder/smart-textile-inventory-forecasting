const store = require('../config/storeAdapter');

exports.getBrands = (req, res) => {
  try {
    const brands = store.getBrands();
    const products = store.getProducts();

    // Attach product count to each brand
    const enriched = brands.map(b => {
      const count = products.filter(p => p.brand.toLowerCase() === b.name.toLowerCase()).length;
      return { ...b, productCount: count };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addBrand = (req, res) => {
  try {
    const { name, code, contact, description, status } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Brand name is required.' });
    }

    const brands = store.getBrands();
    const existing = brands.find(b => b.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: 'Brand with this name already exists.' });
    }

    const newBrand = {
      id: 'BRD-' + Date.now().toString(36).toUpperCase(),
      name: name.trim(),
      code: (code || name.substring(0, 3)).toUpperCase().trim(),
      contact: contact || '',
      description: description || '',
      status: status || 'Active',
      createdAt: new Date().toISOString()
    };

    brands.push(newBrand);
    store.saveBrands(brands);

    res.status(201).json({ success: true, message: 'Brand added successfully', data: newBrand });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateBrand = (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, contact, description, status } = req.body;

    const brands = store.getBrands();
    const index = brands.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    const oldName = brands[index].name;
    const updatedName = name ? name.trim() : oldName;

    brands[index] = {
      ...brands[index],
      name: updatedName,
      code: code ? code.toUpperCase().trim() : brands[index].code,
      contact: contact !== undefined ? contact : brands[index].contact,
      description: description !== undefined ? description : brands[index].description,
      status: status || brands[index].status,
      updatedAt: new Date().toISOString()
    };

    // If brand name changed, cascade update to products
    if (oldName.toLowerCase() !== updatedName.toLowerCase()) {
      const products = store.getProducts();
      products.forEach(p => {
        if (p.brand.toLowerCase() === oldName.toLowerCase()) {
          p.brand = updatedName;
        }
      });
      store.saveProducts(products);
    }

    store.saveBrands(brands);
    res.json({ success: true, message: 'Brand updated successfully', data: brands[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteBrand = (req, res) => {
  try {
    const { id } = req.params;
    const brands = store.getBrands();
    const brand = brands.find(b => b.id === id);
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    const products = store.getProducts();
    const dependentProducts = products.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase());

    if (dependentProducts.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete brand '${brand.name}' because it has ${dependentProducts.length} associated products. Reassign or delete those products first.`
      });
    }

    const filtered = brands.filter(b => b.id !== id);
    store.saveBrands(filtered);

    res.json({ success: true, message: `Brand '${brand.name}' deleted successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
