const { isMongoConnected, localStore } = require('../config/db');

module.exports = {
  getBrands: () => localStore.read('brands'),
  saveBrands: (list) => localStore.write('brands', list),

  getProducts: () => localStore.read('products'),
  saveProducts: (list) => localStore.write('products', list),

  getSales: () => localStore.read('sales'),
  saveSales: (list) => localStore.write('sales', list),

  getTransactions: () => localStore.read('inventoryTransactions'),
  saveTransactions: (list) => localStore.write('inventoryTransactions', list)
};
