const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = express.Router();
app.use('/api/products', productsRouter);

productsRouter.get('/', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const products = JSON.parse(data);
      const response = limit ? products.slice(0, limit) : products;
      res.json(response);
    }
  });
});

productsRouter.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    }
  });
});

productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const products = JSON.parse(data);
      const productId = generateId(products);
      newProduct.id = productId;
      products.push(newProduct);
      fs.writeFile('productos.json', JSON.stringify(products), (err) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ message: 'Product added successfully' });
        }
      });
    }
  });
});

productsRouter.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const products = JSON.parse(data);
      const index = products.findIndex((p) => p.id === productId);
      if (index !== -1) {
        updatedProduct.id = productId;
        products[index] = updatedProduct;
        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
          if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Product updated successfully' });
          }
        });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    }
  });
});

productsRouter.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      let products = JSON.parse(data);
      const initialLength = products.length;
      products = products.filter((p) => p.id !== productId);
      if (products.length !== initialLength) {
        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
          if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Product deleted successfully' });
          }
        });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    }
  });
});


const cartsRouter = express.Router();
app.use('/api/carts', cartsRouter);

cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: generateId([1]),
    products: [],
  };
  fs.writeFile('carrito.json', JSON.stringify(newCart), (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Cart created successfully', cart: newCart });
    }
  });
});

cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const cart = JSON.parse(data);
      if (cart.id === cartId) {
        res.json(cart.products);
      } else {
        res.status(404).json({ error: 'Cart not found' });
      }
    }
  });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  fs.readFile('carrito.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const cart = JSON.parse(data);
      if (cart.id === cartId) {
        const productIndex = cart.products.findIndex((p) => p.product === productId);
        if (productIndex !== -1) {
          cart.products[productIndex].quantity++;
        } else {
          cart.products.push({ product: productId, quantity: 1 });
        }
        fs.writeFile('carrito.json', JSON.stringify(cart), (err) => {
          if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'Product added to cart successfully', cart: cart });
          }
        });
      } else {
        res.status(404).json({ error: 'Cart not found' });
      }
    }
  });
});


function generateId(items) {
  let id = 1;
  if (items.length > 0) {
    const maxId = Math.max(...items.map((item) => item.id));
    id = maxId + 1;
  }
  return id;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
