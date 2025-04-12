import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ICartRepository } from '#/domain/repositories/cart.repository';
import { AddItemToCartCommand } from '../commands/add-item-to-cart.command';
import { PRODUCT_REPOSITORY } from '#/domain/repositories/tokens'; // Импортируем токен
import { IProductRepository } from '#/domain/repositories/product.repository.interface'; // Импортируем интерфейс
import { CartItem } from '#/domain/entities/cart/cart-item.entity';
import { Cart } from '#/domain/entities/cart/cart.entity';

@CommandHandler(AddItemToCartCommand)
export class AddItemToCartHandler implements ICommandHandler<AddItemToCartCommand> {
  constructor(
    @Inject(ICartRepository) private readonly cartRepository: ICartRepository,
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: IProductRepository, // Инжектируем IProductRepository
  ) {}

  async execute(command: AddItemToCartCommand): Promise<Cart> {
    const { userId, productId, quantity } = command;

    // Находим продукт, чтобы получить цену и проверить наличие
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const productPrice = product.price; // Используем реальную цену

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
      // При создании новой корзины, ей нужен ID для связи с CartItem
      // Метод save должен возвращать корзину с ID
      // Пересохраним, чтобы получить ID (если create не возвращает его)
      // cart = await this.cartRepository.save(cart);
    }

    // Логика добавления/обновления CartItem в cart.items
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = productPrice; // Обновляем цену на всякий случай
    } else {
      // Убедимся, что у корзины есть ID перед созданием элемента
      if (!cart.id) {
         // Эта логика может быть избыточна, если create/findByUserId всегда возвращают ID
         // или если save может обработать корзину без ID (как сейчас с upsert)
         console.error('Cart ID is missing after find/create');
         throw new Error('Failed to retrieve Cart ID');
      }
       // Создаем псевдо-id для сущности, т.к. реальный ID будет в БД
      const pseudoId = Date.now();
      const newItem = new CartItem(pseudoId, cart.id, productId, quantity, productPrice);
      cart.items.push(newItem);
    }

    // Сохраняем обновленную корзину
    // Метод save должен корректно обработать добавление/обновление items
    return this.cartRepository.save(cart);
  }
}
