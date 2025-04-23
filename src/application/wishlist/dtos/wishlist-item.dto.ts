import { ApiProperty } from "@nestjs/swagger";
import { ProductDto } from "#/presentation/controllers/product.controller";
import { WishlistItem } from "#/domain/entities/wishlist/wishlist-item.entity";

export class WishlistItemDto {
  @ApiProperty({ description: "ID продукта" })
  productId: number;

  @ApiProperty({ description: "Дата добавления" })
  addedAt: Date;

  @ApiProperty({ type: () => ProductDto, description: "Данные продукта" })
  product: ProductDto;

  static fromEntity(item: WishlistItem): WishlistItemDto {
    const dto = new WishlistItemDto();
    dto.productId = item.productId;
    dto.addedAt = item.addedAt;
    if (item.product) {
      dto.product = ProductDto.fromEntity(item.product);
    }
    return dto;
  }
}
