const mongodb = require("mongodb");

const db = require("../database/mongodb");

class Order {
  // status: pending, fulfilled, cancelled
  constructor(user, cart, status = "pending", date, orderId) {
    this.userInfo = user;
    this.productInfo = cart;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("ko-KR");
    }
    this.id = orderId;
  }

  static transformOrderDocuments(orderDocuments) {
    return orderDocuments.map((orderDocument) => {
      return new Order(
        orderDocument.userInfo,
        orderDocument.productInfo,
        orderDocument.status,
        orderDocument.date,
        orderDocument._id
      );
    })
  }

  static async findAll() {
    const allOrderDocuments = await db.getDatabase().collection("orders").find().sort({ _id: -1 }).toArray(); // descending order by id
    return this.transformOrderDocuments(allOrderDocuments);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orderDocuments = await db.getDatabase().collection("orders").find({ "userInfo._id": uid }).sort({ _id: -1 }).toArray();

    return this.transformOrderDocuments(orderDocuments);
  }

  static async findById(orderId) {
    const orderDocument = await db.getDatabase().collection("orders").findOne({ _id: new mongodb.ObjectId(orderId) });

    const order = new Order(
      orderDocument.userInfo,
      orderDocument.productInfo,
      orderDocument.status,
      orderDocument.date,
      orderDocument._id
    );
    
    return order;
  }

  save() {
    if (this.id) {
      // update old order
      const orderId = new mongodb.ObjectId(this.id);
      db.getDatabase().collection("orders").updateOne({ _id: orderId }, { $set: { status: this.status } });
    } else {
      // create new order
      const orderDocument = {
        userInfo: this.userInfo,
        productInfo: this.productInfo,
        date: new Date(),
        status: this.status
      };

      return db.getDatabase().collection("orders").insertOne(orderDocument);
    }
  }
}

module.exports = Order;
