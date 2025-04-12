import { Order, OrderStatus } from '#/domain/entities/order/order.entity';
// import { OrderItemDto } from './order-item.dto'; // Если будет OrderItem

export class OrderDto {
  id: number;
  userId: number;
  // items: OrderItemDto[]; // Детали заказа
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress?: string;

  static fromEntity(order: Order): OrderDto {
    const dto = new OrderDto();
    dto.id = order.id;
    dto.userId = order.userId;
    dto.totalAmount = order.totalAmount;
    dto.status = order.status;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;
    dto.shippingAddress = order.shippingAddress;
    // dto.items = order.items.map(OrderItemDto.fromEntity); // Если будет OrderItem
    return dto;
  }
}
