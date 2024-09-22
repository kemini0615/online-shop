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
    totalQuantity: cart.totalQuantity,
  });
}

function updateCartItem(req, res) {
  const cart = res.locals.cart;
  const newItemTotalPrice = cart.updateItem(
    req.body.productId,
    +req.body.quantity,
  );
  req.session.cart = cart;
  res.json({
    message: "Item updated.",
    newCart: {
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
      newItemTotalPrice: newItemTotalPrice,
    },
  });
}

module.exports = {
  getCart: getCart,
  addCartItem: addCartItem,
  updateCartItem: updateCartItem,
};
