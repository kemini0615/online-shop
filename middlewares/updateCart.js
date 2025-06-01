async function updateCart(req, res, next) {
  const cart = res.locals.cart;

  await cart.updateCart();

  // 세션에 있는 장바구니 정보도 최신화된 cart 객체의 정보로 갱신한다.
  req.session.cart = {
    items: cart.items,
    totalQuantity: cart.totalQuantity,
    totalPrice: cart.totalPrice,
  };

  next();
}

module.exports = updateCart;
