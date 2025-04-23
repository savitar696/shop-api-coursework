import { OrderItem } from "#/domain/entities/order/order-item.entity";
import { ApiProperty } from "@nestjs/swagger";

export class OrderItemDto {
  @ApiProperty({ description: "ID продукта" })
  productId: number;

  @ApiProperty({ description: "Количество" })
  quantity: number;

  @ApiProperty({ description: "Цена за единицу на момент заказа" })
  price: number;

  static fromEntity(item: OrderItem): OrderItemDto {
    const dto = new OrderItemDto();
    dto.productId = item.productId;
    dto.quantity = item.quantity;
    dto.price = item.price;
    return dto;
  }
}
