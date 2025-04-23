import { IsOptional, IsString, Length } from "class-validator";

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @Length(5, 255)
  shippingAddress?: string;
}
