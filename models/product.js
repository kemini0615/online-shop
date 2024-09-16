const mongodb = require("mongodb");

const db = require("../database/mongodb");

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

  static async findById(id) {
    let productId;
    try {
      productId = new mongodb.ObjectId(id);
    } catch (err) {
      err.code = 404;
      throw err;
    }

    const product = await db.getDatabase().collection("products").findOne({ _id: productId });
    if (!product) {
      const error = new Error("Could not find the data.");
      error.code = 404;
      throw error;
    }
    
    return product;
  }

  static async findAll() {
    const documents = await db.getDatabase().collection("products").find().toArray();
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

    await db.getDatabase().collection("products").insertOne(productData);

  }
}

module.exports = Product;