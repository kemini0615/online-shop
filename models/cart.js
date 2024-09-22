const Product = require("./product");

class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      // update existing cart items
      if (item.product.id === product.id) {
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;

        this.items[i] = cartItem;
        this.totalQuantity++;
        this.totalPrice += product.price;

        return;
      }
    }

    // insert new cart item
    this.items.push(cartItem);
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;

        this.items[i] = cartItem;
        this.totalQuantity += newQuantity - item.quantity;
        this.totalPrice += item.product.price * (newQuantity - item.quantity);
        return cartItem.totalPrice;
      } else if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i, 1);
        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice;
        return 0;
      }
    }
  }

  async updateCart() {
    const productIds = this.items.map((item) => {
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds);

    const deletableIds = [];

    for (let cartItem of this.items) {
      const product = products.find((product) => {
        return (product.id = cartItem.product.id);
      });

      if (!product) {
        deletableIds.push(cartItem.product.id);
        continue;
      }

      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableIds.length > 0) {
      this.items = this.items.filter((item) => {
        return deletableIds.indexOf(item.product.id) < 0;
      });
    }

    this.totalPrice = 0;
    this.totalQuantity = 0;

    for (let item of this.items) {
      this.totalPrice = this.totalPrice + item.totalPrice;
      this.totalQuantity = this.totalQuantity + item.quantity;
    }
  }
}

module.exports = Cart;
