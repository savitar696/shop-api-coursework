// import { User } from '../user/user.entity'; // Если нужно будет связать
// import { OrderItem } from './order-item.entity'; // Аналогично

export enum OrderStatus {
  PENDING = 'PENDING',         // Ожидает оплаты
  PROCESSING = 'PROCESSING',   // В обработке
  SHIPPED = 'SHIPPED',         // Отправлен
  DELIVERED = 'DELIVERED',     // Доставлен
  CANCELLED = 'CANCELLED',     // Отменен
}

export class Order {
  id: number;
  userId: number;
  // user: User;
  // items: OrderItem[]; // Товары заказа (создать OrderItem entity)
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress?: string; // Добавляем адрес доставки
  // Можно добавить адрес доставки, метод оплаты и т.д.

  constructor(
    id: number,
    userId: number,
    totalAmount: number,
    status: OrderStatus,
    createdAt: Date,
    updatedAt: Date,
    shippingAddress?: string, // Добавляем в конструктор
    // user: User,
    // items: OrderItem[],
  ) {
    this.id = id;
    this.userId = userId;
    this.totalAmount = totalAmount;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.shippingAddress = shippingAddress; // Присваиваем значение
    // this.user = user;
    // this.items = items;
  }
}
