function handleNotFound(req, res, next) {
  res.render("shared/404");
}

module.exports = handleNotFound;
