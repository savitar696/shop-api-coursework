import { CartItem } from "#/domain/entities/cart/cart-item.entity";

export class CartItemDto {
  productId: number;
  quantity: number;
  price: number;

  static fromEntity(item: CartItem): CartItemDto {
    const dto = new CartItemDto();
    dto.productId = item.productId;
    dto.quantity = item.quantity;
    dto.price = item.price;
    return dto;
  }
}
