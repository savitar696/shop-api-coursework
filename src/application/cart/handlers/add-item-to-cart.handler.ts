import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { ICartRepository } from "#/domain/repositories/cart.repository";
import { AddItemToCartCommand } from "../commands/add-item-to-cart.command";
import { PRODUCT_REPOSITORY } from "#/domain/repositories/tokens";
import { IProductRepository } from "#/domain/repositories/product.repository.interface";
import { CartItem } from "#/domain/entities/cart/cart-item.entity";
import { Cart } from "#/domain/entities/cart/cart.entity";

@CommandHandler(AddItemToCartCommand)
export class AddItemToCartHandler
  implements ICommandHandler<AddItemToCartCommand>
{
  constructor(
    @Inject(ICartRepository) private readonly cartRepository: ICartRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: AddItemToCartCommand): Promise<Cart> {
    const { userId, productId, quantity } = command;

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const productPrice = product.price;

    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = productPrice;
    } else {
      if (!cart.id) {
        console.error("Cart ID is missing after find/create");
        throw new Error("Failed to retrieve Cart ID");
      }
      const pseudoId = Date.now();
      const newItem = new CartItem(
        pseudoId,
        cart.id,
        productId,
        quantity,
        productPrice,
      );
      cart.items.push(newItem);
    }

    return this.cartRepository.save(cart);
  }
}
