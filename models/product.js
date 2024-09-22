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
    this.setImageData();
  }

  setImageData() {
    this.imagePath = `data/products/images/${this.image}`;
    this.imageUrl = `/products/assets/products/images/${this.image}`;
  }

  static async findById(id) {
    let productId;
    try {
      productId = new mongodb.ObjectId(id);
    } catch (err) {
      err.code = 404;
      throw err;
    }

    const product = await db
      .getDatabase()
      .collection("products")
      .findOne({ _id: productId });
    if (!product) {
      const error = new Error("Could not find the data.");
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  static async findMultiple(ids) {
    const productIds = ids.map((id) => {
      return new mongodb.ObjectId(id);
    });

    const productDocuments = await db
      .getDatabase()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    return productDocuments.map((document) => {
      return new Product(document);
    });
  }

  static async findAll() {
    const documents = await db
      .getDatabase()
      .collection("products")
      .find()
      .toArray();
    const products = documents.map(function (document) {
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
      image: this.image,
    };

    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);
      if (!this.image) {
        delete productData.image; // delete key of the object
      }
      await db
        .getDatabase()
        .collection("products")
        .updateOne({ _id: productId }, { $set: { ...productData } });
    } else {
      await db.getDatabase().collection("products").insertOne(productData);
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.setImageData();
  }

  async remove() {
    const productId = new mongodb.ObjectId(this.id);
    await db.getDatabase().collection("products").deleteOne({ _id: productId });
  }
}

module.exports = Product;
