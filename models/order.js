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
}

module.exports = Order;
