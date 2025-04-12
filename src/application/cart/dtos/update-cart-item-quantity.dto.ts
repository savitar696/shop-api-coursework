import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @IsNotEmpty()
  @IsInt()
  productId: number; // Или cartItemId

  @IsNotEmpty()
  @IsInt()
  @Min(1) // Количество должно быть как минимум 1
  quantity: number;
}
