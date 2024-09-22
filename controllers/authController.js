import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Error 400. Username already exists.' });
      }

      if (!username || username.trim().length === 0) {
        return res.status(400).json({ message: "Error 400. Username can't be empty." });
      }
  
      if (!password || password.trim().length === 0) {
        return res.status(400).json({ message: "Error 400. Password can't be empty." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, password: hashedPassword, role });
      const token = jwt.sign({ username: newUser.username, id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      newUser.session = 'active';
      await newUser.save();

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        maxAge: 3600000,
        sameSite: 'strict',
      });

      res.status(201).json({ 
        message: 'Register successful.'
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Error 400. Invalid input data.', error: error.message });
      }
      
      res.status(500).json({ message: 'Error 500. Error registering user.', error });
    }
  };

export const login = async (req, res) => {
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

    const token = jwt.sign({ username: user.username, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.session = 'active';
    await user.save();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'PRODUCTION',
      maxAge: 3600000,
      sameSite: 'strict',
    });
    
    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error logging in.', error });
  } 
};

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
    res.status(500).json({ message: 'Error 500. Error logging out.', error });
  }
};

export const logoutAll = async (req, res) => {
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

    res.status(200).json({ message: 'All sessions have been terminated.' });
  } catch (error) {
    res.status(500).json({ message: 'Error 500. Error terminating sessions.', error });
  }
};


