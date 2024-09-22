import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Error 404. User not found.' });
        }
        res.status(200).json(user);
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

        if (username) user.username = username;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (role) user.role = role;

        const updatedUser = await user.save();
        res.status(200).json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (error) {
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
