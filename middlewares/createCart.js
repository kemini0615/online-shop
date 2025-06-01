const Cart = require("../models/cart");

function createCart(req, res, next) {
  let cart;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    cart = new Cart(
      req.session.cart.items,
      req.session.cart.totalQuantity,
      req.session.cart.totalPrice
    );
  }

  // res.locals는 현재 요청-응답 사이클 동안만 유효한 데이터를 저장하는 객체다.
  res.locals.cart = cart;
  next();
}

module.exports = createCart;
