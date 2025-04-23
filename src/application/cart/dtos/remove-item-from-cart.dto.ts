import { IsInt, IsNotEmpty } from "class-validator";

export class RemoveItemFromCartDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;
}
