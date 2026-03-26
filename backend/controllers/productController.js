import Product from '../models/Product.js';

export async function getProducts(req, res) {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
}

export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json(product);
}

export async function createProduct(req, res) {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const product = await Product.create({
    ...req.body,
    images: imagePath ? [imagePath] : req.body.images,
  });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const payload = { ...req.body };
  if (imagePath) payload.images = [imagePath];

  const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json(product);
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json({ message: 'Deleted successfully' });
}
