import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Error 404. User not found.' });
    }

    return res.status(200).json({ message: 'User retrieved successfully.', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error 500. Error retrieving user.', error: error.message });
  }
};

export const updateUser = [
    body('username')
    .optional({ checkFalsy: true })
    .trim()
    .not().isEmpty().withMessage('Username cannot be just whitespace.'),

  body('password')
    .optional({ checkFalsy: true })
    .trim()
    .not().isEmpty().withMessage('Password cannot be just whitespace.'),

  body('role')
    .optional({ checkFalsy: true })
    .trim()
    .not().isEmpty().withMessage('Role cannot be just whitespace.')
    .isIn(['buyer', 'seller']).withMessage('Role must be either "buyer" or "seller".'),
  

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    const { username, password, role } = req.body;

    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Error 404. User not found.' });
      }

      if (username) user.username = username;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      if (role) user.role = role;

      const updatedUser = await user.save();

      return res.status(200).json({
        message: 'Profile updated successfully. Please log in again.',
        user: updatedUser
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error 500. Error updating user profile.', error: error.message });
    }
  }
];

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Error 404. User not found.' });
    }

    return res.status(200).json({
      message: 'User deleted successfully.',
      user: deletedUser
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error 500. Error deleting user.', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({ message: 'Users retrieved successfully.', users });
  } catch (error) {
    return res.status(500).json({ message: 'Error 500. Error retrieving users.', error: error.message });
  }
};
