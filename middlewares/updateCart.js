async function updateCart(req, res, next) {
  const cart = res.locals.cart;

  await cart.updateCart();

  next();
}

module.exports = updateCart;