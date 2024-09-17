const Product = require("../models/product");

async function getAllProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("customer/products/all-products", { products: products });
  } catch (err) {
    next(err);
    return;
  }
}

module.exports = {
  getAllProducts: getAllProducts
}