function addToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addToken;
