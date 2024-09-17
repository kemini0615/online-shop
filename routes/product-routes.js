const express = require("express");
const productController = require("../controllers/product-controller");

router = express.Router();

router.get("/products", productController.getAllProducts);

router.get("/products/:productId", productController.getProductDetails);

module.exports = router;
