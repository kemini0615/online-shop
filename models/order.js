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

  save() {
    if (this.id) {
      // update old order
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
