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

  updateItem(productId, newQuantity) {
    for (const i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;

        this.items[i] = cartItem;
        this.totalQuantity += (newQuantity - item.quantity);
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
}

module.exports = Cart;