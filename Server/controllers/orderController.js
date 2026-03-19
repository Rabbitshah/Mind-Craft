import { createOrder, getLatestOrder, getOrderHistory } from "../services/commerceStore.js";

export async function checkout(req, res) {
  const { paymentMethod = "card", billingDetails = {} } = req.body;
  const order = await createOrder({ paymentMethod, billingDetails, user: req.user });

  res.status(201).json({
    message: "Order completed successfully.",
    order,
  });
}

export async function getLatestOrderController(req, res) {
  const order = await getLatestOrder(req.user);

  if (!order) {
    res.status(404);
    throw new Error("No recent order found.");
  }

  res.json({ order });
}

export async function getOrderHistoryController(req, res) {
  const orders = await getOrderHistory(req.user);

  res.json({
    orders,
    count: orders.length,
  });
}
