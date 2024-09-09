const User = require("../models/user");

function getSignup(req, res) {
  res.render("customer/auth/signup");
}

async function signup(req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.address,
    req.body.postal
  );

  await user.signup();

  res.redirect("/login");
}

function getLogin(req, res) {
  res.render("customer/auth/login");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
};
