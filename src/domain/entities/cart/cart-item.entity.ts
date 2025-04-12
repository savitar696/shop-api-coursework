// Пока не будем импортировать, т.к. файл еще не создан
// import { Product } from '../product/product.entity';

export class CartItem {
  id: number;
  cartId: number;
  productId: number;
  // product: Product; // Можно добавить для связи
  quantity: number;
  price: number; // Цена на момент добавления

  constructor(
    id: number,
    cartId: number,
    productId: number,
    quantity: number,
    price: number,
    // product: Product,
  ) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
    // this.product = product;
  }
}
