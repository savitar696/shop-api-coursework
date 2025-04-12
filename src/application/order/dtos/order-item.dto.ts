// Эта сущность понадобится, если мы решим хранить детали заказа отдельно
// import { OrderItem } from '#/domain/entities/order/order-item.entity';

export class OrderItemDto {
  productId: number;
  quantity: number;
  price: number; // Цена на момент создания заказа

  // static fromEntity(item: OrderItem): OrderItemDto {
  //   const dto = new OrderItemDto();
  //   dto.productId = item.productId;
  //   dto.quantity = item.quantity;
  //   dto.price = item.price;
  //   return dto;
  // }
}
