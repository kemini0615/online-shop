const mongodb = require("../database/mongodb");

class Product {
  constructor(productData) {
    if (productData._id) {
      this.id = productData._id.toString();
    }
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; // name of the image whici is unique
    this.imagePath = `data/products/images/${productData.image}`;
    this.imageUrl = `/products/assets/products/images/${productData.image}`;
  }

  static async findAll() {
    const documents = await mongodb.getDatabase().collection("products").find().toArray();
    const products = documents.map(function(document) {
      return new Product(document);
    });

    return products;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image
    }

    await mongodb.getDatabase().collection("products").insertOne(productData);

  }
}

module.exports = Product;