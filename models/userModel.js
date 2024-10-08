import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  deposit: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },
  session: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

const User = mongoose.model('User', userSchema);
export default User;