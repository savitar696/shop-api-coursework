export class CartItem {
  id: number;
  cartId: number;
  productId: number;

  quantity: number;
  price: number;

  constructor(
    id: number,
    cartId: number,
    productId: number,
    quantity: number,
    price: number,
  ) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
  }
}
