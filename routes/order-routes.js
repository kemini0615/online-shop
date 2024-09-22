const express = require("express");

const orderController = require("../controllers/order-controller");

router = express.Router();

router.post("/", orderController.addOrder);

module.exports = router;
