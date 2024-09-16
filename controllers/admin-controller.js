const Product = require("../models/product");

async function getProducts(req, res) {
  try {
    const products = await Product.findAll();
    res.render("admin/products/all-products", { products: products });
  } catch (err) {
    next(err);
    return;
  }
}

function getAddProduct(req, res) {
  const noProduct = {
    title: "",
    summary: "",
    price: "",
    description: ""
  }
  res.render("admin/products/add-product", { product: noProduct });
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

async function getUpdateProduct(req, res) {
  try {
    const product = await Product.findById(req.params.productId);
    res.render("admin/products/update-product", { product: product });
  } catch (err) {
    next(err);
    return;
  }
}

function updateProduct() {

}

module.exports = {
  getProducts: getProducts,
  getAddProduct: getAddProduct,
  addProduct: addProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct
};
