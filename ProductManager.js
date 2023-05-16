const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      id: products.length + 1,
      ...product
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  getProducts() {
    try {
      const fileContent = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      return [];
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(product => product.id === id);
  }

  updateProduct(id, fieldsToUpdate) {
    const products = this.getProducts();
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        return { ...product, ...fieldsToUpdate };
      }
      return product;
    });
    this.saveProducts(updatedProducts);
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    this.saveProducts(filteredProducts);
  }

  saveProducts(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }
}

module.exports = ProductManager;

