import {
  addItemToCart,
  applyPromoCode,
  buildCartPayload,
  clearPromoCode,
  removeItemFromCart,
} from "../services/commerceStore.js";

export async function getCart(req, res) {
  const cart = await buildCartPayload(req.user);
  res.json({ cart });
}

export async function addCartItem(req, res) {
  const { courseId } = req.body;

  if (!courseId) {
    res.status(400);
    throw new Error("courseId is required.");
  }

  const cart = await addItemToCart(courseId, req.user);
  res.status(201).json({ message: "Course added to cart.", cart });
}

export async function removeCartItem(req, res) {
  const cart = await removeItemFromCart(req.params.courseId, req.user);
  res.json({ message: "Course removed from cart.", cart });
}

export async function applyPromo(req, res) {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Promo code is required.");
  }

  const cart = await applyPromoCode(code, req.user);
  res.json({ message: "Promo code applied.", cart });
}

export async function clearPromo(req, res) {
  const cart = await clearPromoCode(req.user);
  res.json({ message: "Promo code cleared.", cart });
}
