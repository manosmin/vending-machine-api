import Product from '../models/productModel.js';

export const addProduct = async (req, res) => {
  const {
    productName,
    cost,
    amountAvailable
  } = req.body;

  const parsedCost = Number(cost);
  const parsedAmountAvailable = Number(amountAvailable);

  if (!Number.isInteger(parsedCost) || parsedCost <= 0) {
    return res.status(400).json({
      message: 'Error 400. Cost must be a positive integer.'
    });
  }

  if (!Number.isInteger(parsedAmountAvailable) || parsedAmountAvailable <= 0) {
    return res.status(400).json({
      message: 'Error 400. Amount available must be a positive integer.'
    });
  }

  try {
    const newProduct = await Product.create({
      productName,
      cost: parsedCost,
      amountAvailable: parsedAmountAvailable,
      sellerId: req.user.id
    });

    res.status(201).json({
      message: 'Product added successfully',
      newProduct
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error 500. Error adding product.',
      error
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      message: 'Products retrieved successfully',
      products
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error 500. Error retrieving products.',
      error
    });
  }
};

export const updateProduct = async (req, res) => {
  const {
    productId
  } = req.params;
  const {
    productName,
    cost,
    amountAvailable
  } = req.body;

  let parsedCost;
  if (cost !== undefined) {
    parsedCost = Number(cost);
    if (!Number.isInteger(parsedCost) || parsedCost <= 0) {
      return res.status(400).json({
        message: 'Error 400. Cost must be a positive integer.'
      });
    }
  }

  let parsedAmountAvailable;
  if (amountAvailable !== undefined) {
    parsedAmountAvailable = Number(amountAvailable);
    if (!Number.isInteger(parsedAmountAvailable) || parsedAmountAvailable <= 0) {
      return res.status(400).json({
        message: 'Error 400. Amount available must be a positive integer.'
      });
    }
  }

  try {
    const updatedProduct = await Product.findById(productId);

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Error 404. Product not found.'
      });
    }

    if (updatedProduct.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Error 403. You are not allowed to update other sellers products.'
      });
    }

    const updatedFields = {};
    if (productName) updatedFields.productName = productName;
    if (parsedCost !== undefined) updatedFields.cost = parsedCost;
    if (parsedAmountAvailable !== undefined) updatedFields.amountAvailable = parsedAmountAvailable;

    const updatedProductInfo = await Product.findByIdAndUpdate(productId, updatedFields, {
      new: true
    });

    res.status(200).json({
      message: 'Product updated successfully.',
      updatedProduct: updatedProductInfo
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error 500. Error updating product.',
      error
    });
  }
};


export const deleteProduct = async (req, res) => {
  const {
    productId
  } = req.params;

  try {
    const deletedProduct = await Product.findById(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        message: 'Error 404. Product not found.'
      });
    }

    if (deletedProduct.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Error 403. You are not allowed to delete other sellers products.'
      });
    }

    await Product.findByIdAndDelete(deletedProduct);
    res.status(200).json({
      message: 'Product deleted successfully.',
      deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error 500. Error deleting product.',
      error
    });
  }
};