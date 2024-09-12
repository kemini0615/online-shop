function addCsrfToken(req, res, next) {
  // res.locals could be accessed and used on every view
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;
