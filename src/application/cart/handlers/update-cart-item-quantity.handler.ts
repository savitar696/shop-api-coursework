import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICartRepository } from '#/domain/repositories/cart.repository';
import { UpdateCartItemQuantityCommand } from '../commands/update-cart-item-quantity.command';
import { Cart } from '#/domain/entities/cart/cart.entity';

@CommandHandler(UpdateCartItemQuantityCommand)
export class UpdateCartItemQuantityHandler implements ICommandHandler<UpdateCartItemQuantityCommand> {
  constructor(
    @Inject(ICartRepository) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(command: UpdateCartItemQuantityCommand): Promise<Cart> {
    const { userId, productId, quantity } = command;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be positive');
    }

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException(`Cart for user ${userId} not found`);
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      throw new NotFoundException(`Product ${productId} not found in cart`);
    }

    // Обновляем количество
    cart.items[itemIndex].quantity = quantity;
    // Здесь можно также обновить цену, если она могла измениться
    // const productPrice = await this.productRepository.findPrice(productId); // Пример
    // cart.items[itemIndex].price = productPrice;

    // Сохраняем обновленную корзину
    return this.cartRepository.save(cart);
  }
}
