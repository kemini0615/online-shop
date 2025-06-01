const Product = require("./product");

class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  // 장바구니에 상품을 추가한다.
  addItem(product) {
    // 장바구니에 추가될 아이템 객체를 생성한다.
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };

    // 이미 장바구니에 동일한 상품이 있는지 확인한다.
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      // 만약 장바구니에 이미 있는 상품이라면,
      if (item.product.id === product.id) {
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;

        // 장바구니의 해당 아이템을 업데이트된 cartItem으로 교체한다.
        this.items[i] = cartItem;
        this.totalQuantity++;
        this.totalPrice += product.price;

        return;
      }
    }

    // 장바구니에 없는 새로운 상품이라면, items 배열에 cartItem을 추가한다.
    this.items.push(cartItem);
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  // 장바구니의 특정 상품 수량을 변경한다.
  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      // 현재 아이템의 상품 ID가 변경하려는 상품 ID와 같고, 새로운 수량이 0보다 크면
      if (item.product.id === productId && newQuantity > 0) {
        const cartItem = { ...item };
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;

        // 장바구니의 해당 아이템을 업데이트된 cartItem으로 교체한다.
        this.items[i] = cartItem;
        this.totalQuantity += newQuantity - item.quantity;
        this.totalPrice += item.product.price * (newQuantity - item.quantity);
        return cartItem.totalPrice;
      } else if (item.product.id === productId && newQuantity <= 0) {
        // 만약 새로운 수량이 0 이하이면 items 배열에서 해당 아이템을 제거한다.
        this.items.splice(i, 1);
        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice;
        return 0;
      }
    }
  }

  // 장바구니 정보를 최신 상품 정보(DB 기준)로 업데이트한다.
  async updateCart() {
    const productIds = this.items.map((item) => {
      return item.product.id;
    });

    // 만약 장바구니가 비어있다면 모든 값을 0으로 초기화하고 종료한다.
    if (!productIds || productIds.length === 0) {
      this.totalPrice = 0;
      this.totalQuantity = 0;
      return;
    }

    // DB에서 최신 상품 정보 가져온다.
    const products = await Product.findMultiple(productIds);

    // 삭제할 상품 ID를 찾고, 장바구니 상품 정보 업데이트 준비한다.
    const deletableIds = [];

    // DB에서 가져온 최신 상품 목록 중에 현재 장바구니 상품과 ID가 일치하는 상품을 찾는다.
    for (let cartItem of this.items) {
      const product = products.find((product) => {
        return product.id === cartItem.product.id;
      });

      // 만약 DB에서 해당 상품을 찾을 수 없다면, 그 상품의 ID를 deletableIds 배열에 추가한다.
      // 이 상품은 나중에 장바구니에서 제거한다.
      if (!product) {
        deletableIds.push(cartItem.product.id);
        continue;
      }

      // 장바구니 내 상품 정보 업데이트한다.
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

    // 장바구니 전체 총액 및 총수량 재계산한다.
    for (let item of this.items) {
      this.totalPrice = this.totalPrice + item.totalPrice;
      this.totalQuantity = this.totalQuantity + item.quantity;
    }
  }
}

module.exports = Cart;
