const express = require("express");
const productController = require("../controllers/product-controller");

router = express.Router();

router.get("/products", productController.getAllProducts);

// 동적 라우팅
router.get("/products/:productId", productController.getProductDetails);

module.exports = router;
