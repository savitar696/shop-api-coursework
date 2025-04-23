import { CartItem } from "./cart-item.entity";

export class Cart {
  id: number;
  userId: number;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    userId: number,
    items: CartItem[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
