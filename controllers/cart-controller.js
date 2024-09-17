const Product = require("../models/product");

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
  addCartItem: addCartItem
}