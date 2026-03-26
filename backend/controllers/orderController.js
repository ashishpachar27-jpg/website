import Order from '../models/Order.js';

export async function createOrder(req, res) {
  const order = await Order.create({ ...req.body, user: req.user.id });
  res.status(201).json(order);
}

export async function getOrders(req, res) {
  const orders = await Order.find({ user: req.user.id }).populate('items.product');
  res.json(orders);
}
