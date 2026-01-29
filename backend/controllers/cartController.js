import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Helper to recalc totals
function calculateTotals(cart) {
  cart.totalQuantity = cart.items.reduce((a, i) => a + i.quantity, 0);
  cart.totalPrice = cart.items.reduce((a, i) => a + i.quantity * i.price, 0);
}

// 🛒 GET CART
export async function getCart(req, res) {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product",
    "name price primaryImage"
  );

  res.json({ cart });
}

// ➕ ADD TO CART
export async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.status !== "active") {
    return res.status(404).json({ error: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const existingItem = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  calculateTotals(cart);
  await cart.save();

  res.json({ cart });
}

// ➖ UPDATE QUANTITY
export async function updateCartItem(req, res) {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  const item = cart.items.find(
    (i) => i.product.toString() === productId
  );

  if (!item) return res.status(404).json({ error: "Item not found" });

  item.quantity = quantity;
  calculateTotals(cart);
  await cart.save();

  res.json({ cart });
}

// ❌ REMOVE ITEM
export async function removeFromCart(req, res) {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== productId
  );

  calculateTotals(cart);
  await cart.save();

  res.json({ cart });
}
