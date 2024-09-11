const User = require("../models/user");
const authUtil = require("../utils/authentication");

function getSignup(req, res) {
  res.render("customer/auth/signup");
}

async function signup(req, res, next) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.address,
    req.body.postal
  );

  // Express error handler middleware could not handle asynchronous errors
  // You should handle these kinds of errors with try-catch
  try {
    await user.signup();
  } catch(err) {
    next(); // express error handler middleware would be active
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res, next) {
  res.render("customer/auth/login");
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password);

  let existingUser;
  
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch(err) {
    next();
    return;
  }

  if (!existingUser) {
    res.redirect("/login");
    return;
  }

  const passwordIsCorrect = await user.hasCorrectPassword(existingUser.password);

  if (!passwordIsCorrect) {
    res.redirect("/login");
    return;
  }

  authUtil.createUserSession(req, existingUser, function() {
    res.redirect("/");
  })
}

function logout(req, res) {
  authUtil.destroyUserSession(req);
  res.redirect("/")
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login: login,
  logout: logout
};
