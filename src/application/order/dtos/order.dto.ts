import { Order, OrderStatus } from "#/domain/entities/order/order.entity";
import { OrderItemDto } from "./order-item.dto";
import { ApiProperty } from "@nestjs/swagger";

export class OrderDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty({ type: () => [OrderItemDto] })
  items: OrderItemDto[];
  @ApiProperty()
  totalAmount: number;
  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ required: false, nullable: true })
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
    dto.items = order.items.map(OrderItemDto.fromEntity);
    return dto;
  }
}
