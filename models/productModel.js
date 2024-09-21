import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  amountAvailable: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
