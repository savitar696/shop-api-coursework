import { IsOptional, IsString, Length } from 'class-validator';

// Тело запроса может быть пустым, т.к. заказ создается на основе корзины пользователя
// Можно добавить поля, если требуется передать доп. информацию, например, адрес доставки
export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @Length(5, 255) // Пример ограничения длины адреса
  shippingAddress?: string;
}
