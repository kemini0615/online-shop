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
      totalPrice: product.price
    };

    for (const i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      // update existing cart items
      if (item.product.id === product.id) {
        cartItem.quantity = item.quantity + 1;
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
}

module.exports = Cart;