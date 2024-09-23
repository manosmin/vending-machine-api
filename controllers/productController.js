import Product from '../models/productModel.js';
import { body, param, validationResult } from 'express-validator';

export const addProduct = [
  body('productName').isString().trim().notEmpty().withMessage("Product name can't be empty.").escape(),
  body('cost').isInt({ gt: 0 }).withMessage('Cost must be a positive integer.'),
  body('amountAvailable').isInt({ gt: 0 }).withMessage('Amount available must be a positive integer.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    const { productName, cost, amountAvailable } = req.body;

    try {
      const newProduct = await Product.create({
        productName,
        cost: Number(cost),
        amountAvailable: Number(amountAvailable),
        sellerId: req.user.id,
      });

      return res.status(201).json({
        message: 'Product added successfully',
        newProduct,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error 500. Error adding product.',
        error: error.message,
      });
    }
  }
];

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      message: 'Products retrieved successfully',
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error 500. Error retrieving products.',
      error: error.message,
    });
  }
};

export const updateProduct = [
  param('productId').isMongoId().withMessage('Invalid product ID.'),
  body('productName').optional().isString().trim().notEmpty().withMessage("Product name can't be empty.").escape(),
  body('cost').optional().isInt({ gt: 0 }).withMessage('Cost must be a positive integer.'),
  body('amountAvailable').optional().isInt({ gt: 0 }).withMessage('Amount available must be a positive integer.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    const { productId } = req.params;
    const { productName, cost, amountAvailable } = req.body;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          message: 'Error 404. Product not found.',
        });
      }

      if (product.sellerId.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Error 403. You are not allowed to update other sellers\' products.',
        });
      }

      const updatedFields = {};
      if (productName) updatedFields.productName = productName;
      if (cost) updatedFields.cost = Number(cost);
      if (amountAvailable) updatedFields.amountAvailable = Number(amountAvailable);

      const updatedProductInfo = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });

      return res.status(200).json({
        message: 'Product updated successfully.',
        updatedProduct: updatedProductInfo,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error 500. Error updating product.',
        error: error.message,
      });
    }
  }
];

export const deleteProduct = [
  param('productId').isMongoId().withMessage('Invalid product ID.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    const { productId } = req.params;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          message: 'Error 404. Product not found.',
        });
      }

      if (product.sellerId.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Error 403. You are not allowed to delete other sellers\' products.',
        });
      }

      await Product.findByIdAndDelete(productId);
      return res.status(200).json({
        message: 'Product deleted successfully.',
        deletedProduct: product,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error 500. Error deleting product.',
        error: error.message,
      });
    }
  }
];
