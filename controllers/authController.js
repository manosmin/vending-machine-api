import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult, body } from 'express-validator';

export const register = [
  
  body('username').isString().trim().notEmpty().withMessage("Username can't be empty.")
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
    .escape(),
  body('password').isString().trim().notEmpty().withMessage("Password can't be empty.")
    .isLength({ min: 3 }).withMessage('Password must be at least 3 characters long.')
    .escape(),
  body('role').optional().isIn(['buyer', 'seller']).withMessage('Invalid role provided.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    const { username, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Error 400. Username already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, password: hashedPassword, role });

      const token = jwt.sign(
        { username: newUser.username, id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      newUser.session = 'active';
      await newUser.save();

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        maxAge: 3600000,
        sameSite: 'strict',
      });

      return res.status(201).json({ message: 'Register successful.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error 500. Error registering user.', error: error.message });
    }
  }
];

export const login = [
  body('username').isString().trim().notEmpty().withMessage("Username can't be empty.").escape(),
  body('password').isString().trim().notEmpty().withMessage("Password can't be empty.").escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'Error 404. User not found.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Error 401. Invalid credentials.' });
      }

      if (user.session === 'active') {
        return res.status(403).json({ message: 'Error 403. There is already an active session using your account.' });
      }

      const token = jwt.sign(
        { username: user.username, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      user.session = 'active';
      await user.save();

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        maxAge: 3600000,
        sameSite: 'strict',
      });

      return res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error 500. Error logging in.', error: error.message });
    }
  }
];

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await User.findById(req.user.id);

    if (user) {
      user.session = 'inactive';
      await user.save();
    }

    res.clearCookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'PRODUCTION',
      sameSite: 'strict',
    });

    return res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error 500. Error logging out.', error: error.message });
  }
};

export const logoutAll = [
  body('username').isString().trim().notEmpty().withMessage("Username can't be empty.").escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error 400. Invalid input data.', errors: errors.array() });
    }

    try {
      const token = req.cookies.token;
      const { username } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'Error 404. User not found.' });
      }

      user.session = 'inactive';
      await user.save();

      res.clearCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        sameSite: 'strict',
      });

      return res.status(200).json({ message: 'All sessions have been terminated.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error 500. Error terminating sessions.', error: error.message });
    }
  }
];
