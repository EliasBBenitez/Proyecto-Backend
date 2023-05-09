const ProductManager = require('./ProductManager');

const manager = new ProductManager();

manager.addProduct({
  title: 'Producto 1',
  description: 'Descripción del producto 1',
  price: 100,
  thumbnail: '',
  code: 'PROD1',
  stock: 10
});

console.log(manager.getProducts());

console.log(manager.getProductById(1));
