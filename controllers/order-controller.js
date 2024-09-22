
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/order");
const User = require("../models/user");

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
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

  // Stripe API
  // https://docs.stripe.com/checkout/embedded/quickstart
  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map((item)=>{
      return {
        price_data: {
          currency: "krw",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price
        },
        quantity: item.quantity,
      }
    }),
    mode: 'payment',
    success_url: `http://${process.env.DOMAIN}:3000/orders/success`,
    cancel_url: `http://${process.env.DOMAIN}:3000/orders/cancel`,
  });

  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render("customer/orders/success");
}

function getCancel(req, res) {
  res.render("customer/orders/cancel");
}

module.exports = {
  getOrders: getOrders,
  addOrder: addOrder,
  getSuccess: getSuccess,
  getCancel: getCancel
};
