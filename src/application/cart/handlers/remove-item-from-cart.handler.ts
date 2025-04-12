import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '#/domain/repositories/cart.repository';
import { RemoveItemFromCartCommand } from '../commands/remove-item-from-cart.command';
import { Cart } from '#/domain/entities/cart/cart.entity';

@CommandHandler(RemoveItemFromCartCommand)
export class RemoveItemFromCartHandler implements ICommandHandler<RemoveItemFromCartCommand> {
  constructor(
    @Inject(ICartRepository) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(command: RemoveItemFromCartCommand): Promise<Cart> {
    const { userId, productId } = command;

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found`);
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      // Можно бросить ошибку или просто ничего не делать
      throw new NotFoundException(`Product ${productId} not found in cart`);
      // return cart; // Альтернатива: ничего не менять, если товара нет
    }

    // Удаляем товар из массива
    cart.items.splice(itemIndex, 1);

    // Сохраняем обновленную корзину
    return this.cartRepository.save(cart);
  }
}
