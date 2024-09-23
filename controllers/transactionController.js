import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { body, validationResult } from 'express-validator';

export const deposit = [
  body('amount').isInt({ gt: 0 }).withMessage('Amount must be a positive integer.').toInt(),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    const { amount } = req.body;
    const validCoins = [5, 10, 20, 50, 100];

    if (!validCoins.includes(amount)) {
      return res.status(400).json({
        message: 'Error 400. Invalid coin value. Accepted coins: 5, 10, 20, 50, 100.'
      });
    }

    try {
      const user = await User.findById(req.user.id);
      user.deposit += amount;
      await user.save();

      return res.status(200).json({
        message: 'Deposit successful.',
        deposit: user.deposit
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error 500. Error processing deposit.',
        error: error.message
      });
    }
  }
];

export const buy = [
  body('productId').isMongoId().withMessage('Invalid product ID.'),
  body('amount').isInt({ gt: 0 }).withMessage('Amount must be a positive integer.').toInt(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    const { productId, amount } = req.body;

    try {
      const user = await User.findById(req.user.id);
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Error 404. Product not found.' });
      }

      if (product.amountAvailable < amount) {
        return res.status(400).json({ message: 'Error 400. Insufficient product availability.' });
      }

      const totalCost = product.cost * amount;

      if (user.deposit < totalCost) {
        return res.status(400).json({ message: 'Error 400. Insufficient funds.' });
      }

      product.amountAvailable -= amount;
      user.deposit -= totalCost;

      await product.save();
      await user.save();

      const changeCoins = calculateChange(user.deposit);

      return res.status(200).json({
        message: 'Purchase successful.',
        totalSpent: totalCost,
        productsPurchased: {
          productId,
          amount
        },
        change: changeCoins
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error 500. Error processing purchase.',
        error: error.message
      });
    }
  }
];

export const reset = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.deposit = 0;
    await user.save();

    return res.status(200).json({
      message: 'Deposit reset successful.',
      deposit: user.deposit
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error 500. Error resetting deposit.',
      error: error.message
    });
  }
};

const calculateChange = (amount) => {
  const coins = [100, 50, 20, 10, 5];
  const changeCoins = [];

  for (const coin of coins) {
    while (amount >= coin) {
      changeCoins.push(coin);
      amount -= coin;
    }
  }

  return changeCoins;
};
