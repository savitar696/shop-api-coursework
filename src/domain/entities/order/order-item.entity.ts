export class OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;

  constructor(
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
  ) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
  }

  static fromPersistence(data: any): OrderItem {
    return new OrderItem(
      data.id,
      data.orderId,
      data.productId,
      data.quantity,
      data.price,
    );
  }
}
