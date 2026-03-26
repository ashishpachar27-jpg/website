import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: String },
    sizes: [{ type: String }],
    colors: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
