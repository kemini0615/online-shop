function getProducts(req, res) {
  res.render("admin/products/all-products");
}

function getAddProduct(req, res) {
  res.render("admin/products/add-product");
}

function addProduct() {}

module.exports = {
  getProducts: getProducts,
  getAddProduct: getAddProduct,
  addProduct: addProduct,
};
