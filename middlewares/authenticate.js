function authenticate(req, res, next) {
  const uid = req.session.uid;
  if (!uid) {
    return next();
  }

  res.locals.uid = uid;
  res.locals.isAuthenticated = true;
  res.locals.isAdmin = req.session.isAdmin;
  next();
}

module.exports = authenticate;
