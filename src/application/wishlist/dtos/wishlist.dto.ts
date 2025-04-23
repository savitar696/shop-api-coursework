import { ApiProperty } from "@nestjs/swagger";
import { WishlistItemDto } from "./wishlist-item.dto";
import { Wishlist } from "#/domain/entities/wishlist/wishlist.entity";

export class WishlistDto {
  @ApiProperty({ description: "ID списка избранного" })
  id: number;

  @ApiProperty({ type: [WishlistItemDto], description: "Товары в избранном" })
  items: WishlistItemDto[];

  static fromEntity(wishlist: Wishlist): WishlistDto {
    const dto = new WishlistDto();
    dto.id = wishlist.id;
    dto.items = wishlist.items.map(WishlistItemDto.fromEntity);
    return dto;
  }
}
