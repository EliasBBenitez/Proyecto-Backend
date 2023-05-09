class ProductManager {
    constructor() {
      this.products = [];
      this.idCounter = 1;
    }
  
    addProduct(product) {
      if (this.products.some(p => p.code === product.code)) {
        console.error('El código del producto ya existe');
        return;
      }
  
      if (!product.title || !product.description || !product.price ||
          !product.thumbnail || !product.code || !product.stock) {
        console.error('Todos los campos son obligatorios');
        return;
      }
  
      this.products.push({
        id: this.idCounter++,
        ...product
      });
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(p => p.id === id);
  
      if (product) {
        return product;
      } else {
        console.error('Producto no encontrado');
        return null;
      }
    }
  }
module.exports = ProductManager;
