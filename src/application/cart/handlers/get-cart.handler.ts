import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '#/domain/repositories/cart.repository';
import { GetCartQuery } from '../queries/get-cart.query';
import { CartDto } from '../dtos/cart.dto';
import { Cart } from '#/domain/entities/cart/cart.entity';

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery> {
  constructor(
    @Inject(ICartRepository) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(query: GetCartQuery): Promise<CartDto> {
    const { userId } = query;
    let cart = await this.cartRepository.findByUserId(userId);

    // Если корзины нет, создаем пустую (или можно бросать ошибку)
    if (!cart) {
      // Здесь можно либо создать корзину, либо вернуть "пустой" DTO
      // или бросить NotFoundException, если считаем, что корзина должна быть
      // cart = await this.cartRepository.create(userId); // Вариант с созданием

      // Вариант с возвратом пустого DTO (или почти пустого)
      return {
        id: 0, // Или null, если id необязателен в DTO
        userId: userId,
        items: [],
        total: 0,
      };
    }

    // Преобразуем сущность Cart в CartDto
    return CartDto.fromEntity(cart);
  }
}
