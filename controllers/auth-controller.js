const User = require("../models/user");
const authUtil = require("../utils/authentication");
const validationUtil = require("../utils/validation");
const flashUtil = require("../utils/flash");

function getSignup(req, res) {
  let flashedData = flashUtil.getFlashedData(req);

  if (!flashedData) {
    flashedData = {
      email: "",
      password: "",
      confirmPassword: "",
      fullname: "",
      address: "",
      postal: ""
    }
  }

  res.render("customer/auth/signup", { flash: flashedData });
}

async function signup(req, res, next) {
  const userInputData = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body['confirm-password'],
    fullname: req.body.fullname,
    address: req.body.address,
    postal: req.body.postal
  };

  if (
    !validationUtil.checkValidationForSignup(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.address,
      req.body.postal
    ) || !validationUtil.passwordIsConfirmed(req.body['password'], req.body['confirm-password'])
  ) {
    flashUtil.flashDataToSession(req, {
      errorLog: "Invalid Data.",
      ...userInputData
    }, function() {});
    res.redirect("/signup");
    return;
  }

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
    if (await user.existsAlready()) {
      flashUtil.flashDataToSession(req, {
        errorLog: "Existing user.",
        ...userInputData
      }, function() {});
      res.redirect("/signup");
      return;
    }

    await user.signup();
  } catch (err) {
    next(); // express error handler middleware would be active
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res, next) {
  let flashedData = flashUtil.getFlashedData(req);

  if (!flashedData) {
    flashedData = {
      email: "",
      password: ""
    }
  }

  res.render("customer/auth/login", { flash: flashedData });
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password);

  let existingUser;

  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (err) {
    next();
    return;
  }

  if (!existingUser) {
    flashUtil.flashDataToSession(req, {
      errorLog: "No such user.",
      email: req.body.email,
      password: req.body.password
    }, function() {});
    res.redirect("/login");
    return;
  }

  const passwordIsCorrect = await user.hasCorrectPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    flashUtil.flashDataToSession(req, {
      errorLog: "Invalid credentials.",
      email: req.body.email,
      password: req.body.password
    }, function() {});
    res.redirect("/login");
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserSession(req);
  res.redirect("/");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login: login,
  logout: logout,
};
