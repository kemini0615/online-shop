function getProducts(req, res) {
  res.render("admin/products/all-products");
}

function getAddProduct(req, res) {
  res.render("admin/products/add-product");
}

function addProduct(req, res) {
  console.log(req.body);
  console.log(req.file);

  res.redirect("/admin/products");
}

module.exports = {
  getProducts: getProducts,
  getAddProduct: getAddProduct,
  addProduct: addProduct,
};
