import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { WISHLIST_REPOSITORY } from "#/domain/repositories/wishlist.repository.interface";
import { IWishlistRepository } from "#/domain/repositories/wishlist.repository.interface";
import { AddProductToWishlistCommand } from "../commands/add-product-to-wishlist.command";
import { Wishlist } from "#/domain/entities/wishlist/wishlist.entity";

@CommandHandler(AddProductToWishlistCommand)
export class AddProductToWishlistHandler
  implements ICommandHandler<AddProductToWishlistCommand>
{
  constructor(
    @Inject(WISHLIST_REPOSITORY)
    private readonly wishlistRepository: IWishlistRepository,
  ) {}

  async execute(command: AddProductToWishlistCommand): Promise<Wishlist> {
    const { userId, productId } = command;
    return this.wishlistRepository.addProduct(userId, productId);
  }
}
