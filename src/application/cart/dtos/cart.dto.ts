import { Cart } from "#/domain/entities/cart/cart.entity";
import { CartItemDto } from "./cart-item.dto";

export class CartDto {
  id: number;
  userId: number;
  items: CartItemDto[];
  total: number;

  static fromEntity(cart: Cart): CartDto {
    const dto = new CartDto();
    dto.id = cart.id;
    dto.userId = cart.userId;
    dto.items = cart.items.map(CartItemDto.fromEntity);
    dto.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return dto;
  }
}
