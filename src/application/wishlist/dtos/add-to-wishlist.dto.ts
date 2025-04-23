import { IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddToWishlistDto {
  @ApiProperty({ description: "ID продукта для добавления в избранное" })
  @IsInt()
  productId: number;
}
