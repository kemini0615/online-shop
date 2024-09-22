const Order = require("../models/order");
const User = require("../models/user");

function getOrders(req, res) {
  res.render("customer/orders/all-orders");
}

async function addOrder(req, res) {
  const cart = res.locals.cart;
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }
  const order = new Order(userDocument, cart);

  try {
    await order.save();
    req.session.cart = null;
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/orders");
}

module.exports = {
  getOrders: getOrders,
  addOrder: addOrder
}