const express = require("express");

const adminController = require("../controllers/admin-controller");
const handleImage = require("../middlewares/handleImage");

const router = express.Router();

// '/admin' is omiited from path
router.get("/products", adminController.getProducts);

router.get("/products/add", adminController.getAddProduct);
router.post("/products/add", handleImage, adminController.addProduct);

router.get("/products/update/:productId", adminController.getUpdateProduct); // dynamic routes
router.post("/products/update/:productId", handleImage, adminController.updateProduct);

module.exports = router;
