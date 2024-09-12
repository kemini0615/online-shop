const express = require("express");

router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/products");
});

module.exports = router;
