const Product = require("../models/product");

function getCart(req, res) {
  res.render("customer/cart/cart");
}

async function addCartItem(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.body.productId);
  } catch (err) {
    next(err);
    return;
  }

  const cart = res.locals.cart;

  cart.addItem(product);
  req.session.cart = cart;

  res.status(201).json({
    message: "You added product to cart.",
    totalQuantity: cart.totalQuantity
  });
}

module.exports = {
  getCart: getCart,
  addCartItem: addCartItem
}