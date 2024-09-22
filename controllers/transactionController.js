import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const deposit = async (req, res) => {
  const { amount } = req.body;
  const parsedAmount = parseInt(amount);

  const validCoins = [5, 10, 20, 50, 100];
  if (!validCoins.includes(parsedAmount)) {
    return res.status(400).json({ message: 'Error 400. Invalid coin value. Accepted coins: 5, 10, 20, 50, 100.' });
  }

  try {
    const user = await User.findById(req.user.id);
    user.deposit += parsedAmount;
    await user.save();
    res.status(200).json({ message: 'Deposit successful.', deposit: user.deposit });
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error processing deposit.', error });
  }
};

export const buy = async (req, res) => {
  const { productId, amount } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);

    const parsedAmount = Number(amount);

    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Error 400. Amount must be a positive integer.' });
    }

    if (!product || product.amountAvailable < parsedAmount) {
      return res.status(400).json({ message: 'Error 400. Insufficient product availability.' });
    }

    const totalCost = product.cost * parsedAmount;

    if (user.deposit < totalCost) {
      return res.status(400).json({ message: 'Error 400. Insufficient funds.' });
    }

    product.amountAvailable -= parsedAmount;
    user.deposit -= totalCost;

    await product.save();
    await user.save();

    const change = user.deposit;
    const changeCoins = calculateChange(change);

    res.status(200).json({
      message: 'Purchase successful.',
      totalSpent: totalCost,
      productsPurchased: {
        productId,
        amount: parsedAmount
      },
      change: changeCoins
    });
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error processing purchase.', error });
  }
};

export const reset = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.deposit = 0;
    await user.save();
    res.status(200).json({ message: 'Deposit reset successful.', deposit: user.deposit });
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error resetting deposit.', error });
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
