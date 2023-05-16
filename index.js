const ProductManager = require('./ProductManager');

const productManager = new ProductManager('products.json');

productManager.addProduct({
  title: 'Producto 1',
  description: 'Descripción del producto 1',
  price: 100,
  thumbnail: '',
  code: 'PROD1',
  stock: 10
});

const products = productManager.getProducts();

const product = productManager.getProductById(1);

productManager.updateProduct(1, { price: 150 });

productManager.deleteProduct(1);
