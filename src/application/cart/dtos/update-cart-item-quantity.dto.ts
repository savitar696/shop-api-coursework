import { IsInt, IsNotEmpty, Min } from "class-validator";

export class UpdateCartItemQuantityDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
