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
    res.status(500).json({ message: 'Error creating product', error });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { productName, cost, amountAvailable } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      productName,
      cost,
      amountAvailable
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
