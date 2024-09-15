const express = require("express");

const adminController = require("../controllers/admin-controller");

const router = express.Router();

// '/admin' is omiited from path
router.get("/products", adminController.getProducts);
router.get("/products/add", adminController.getAddProduct);
router.post("products/add", adminController.addProduct);

module.exports = router;
