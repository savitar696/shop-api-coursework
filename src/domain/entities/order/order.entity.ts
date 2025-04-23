import { User } from "#/domain/entities/user.entity";
import { OrderItem } from "./order-item.entity";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export class Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress?: string;

  constructor(
    id: number,
    userId: number,
    totalAmount: number,
    status: OrderStatus,
    createdAt: Date,
    updatedAt: Date,
    items: OrderItem[],
    shippingAddress?: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.totalAmount = totalAmount;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.items = items;
    this.shippingAddress = shippingAddress;
  }

  static fromPersistence(data: any): Order {
    const items = data.items?.map(OrderItem.fromPersistence) ?? [];
    return new Order(
      data.id,
      data.userId,
      data.totalAmount,
      data.status,
      data.createdAt,
      data.updatedAt,
      items,
      data.shippingAddress,
    );
  }
}
