function isEmpty(value) {
  return !value || value.trim() === "";
}

function passwordIsConfirmed(password, confirmPassword) {
  return password === confirmPassword;
}

function checkValidationForLogin(email, password) {
  return (
    email && email.includes("@") && password && password.trim().length >= 6
  );
}

function checkValidationForSignup(email, password, fullname, address, postal) {
  return (
    email &&
    email.includes("@") &&
    password &&
    password.trim().length >= 6 &&
    !isEmpty(fullname) &&
    !isEmpty(address) &&
    !isEmpty(postal)
  );
}

module.exports = {
  passwordIsConfirmed: passwordIsConfirmed,
  checkValidationForLogin: checkValidationForLogin,
  checkValidationForSignup: checkValidationForSignup,
};
