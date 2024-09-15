const Product = require("../models/product");

function getProducts(req, res) {
  res.render("admin/products/all-products");
}

function getAddProduct(req, res) {
  res.render("admin/products/add-product");
}

async function addProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (err) {
    next(err);
    return;
  }

  res.redirect("/admin/products");
}

module.exports = {
  getProducts: getProducts,
  getAddProduct: getAddProduct,
  addProduct: addProduct,
};
