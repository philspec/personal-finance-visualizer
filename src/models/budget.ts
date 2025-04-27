import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  month: {
    type: String,
    required: [true, 'Month is required'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema); 