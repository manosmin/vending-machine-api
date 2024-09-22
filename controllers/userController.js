import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Error 404. User not found.' });
        }
        res.status(200).json({message: 'User retrieved succesfully', users: user});
    } catch (error) {
        res.status(500).json({ message: 'Error 500. Error retrieving user.', error });
    }
};

export const updateUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'Error 404. User not found.' });
        }

        if (username && username.trim().length === 0) {
            return res.status(400).json({ message: "Error 400. Username can't be empty or just whitespace." });
        }

        if (password && password.trim().length === 0) {
            return res.status(400).json({ message: "Error 400. Password can't be empty or just whitespace." });
        }

        if (username) user.username = username;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (role) user.role = role;

        const updatedUser = await user.save();
        res.status(200).json({ message: 'Profile updated successfully. Please login again.', user: updatedUser });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error 400. Invalid input data.', error: error.message });
          }
        
        res.status(500).json({ message: 'Error 500. Error updating user profile.', error });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'Error 404. User not found.' });
        }
        
        res.status(200).json({ message: 'User deleted successfully.', user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error 500. Error deleting user.', error });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({message: 'Users retrieved succesfully', users});
    } catch (error) {
        res.status(500).json({ message: 'Error 500. Error retrieving users.', error });
    }
};
