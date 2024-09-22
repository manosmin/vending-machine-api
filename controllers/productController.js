import Product from '../models/productModel.js';

export const createProduct = async (req, res) => {
  const { productName, cost, amountAvailable } = req.body;

  try {
    const newProduct = await Product.create({
      productName,
      cost,
      amountAvailable,
      sellerId: req.user.id
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error creating product.', error });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error retrieving products.', error });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { productName, cost, amountAvailable } = req.body;

  try {
    const updatedProduct = await Product.findById(productId);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Error 404. Product not found.' });
    }

    if (updatedProduct.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Error 403. You are not allowed to update other sellers products.' });
    }

    await Product.findByIdAndUpdate(productId, {
      productName,
      cost,
      amountAvailable
    }, { new: true });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error updating product.', error });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Error 404. Product not found.' });
    }

    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Error 403. You are not allowed to delete other sellers products.' });
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error deleting product.', error });
  }
};
