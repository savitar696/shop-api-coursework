import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { WISHLIST_REPOSITORY } from "#/domain/repositories/wishlist.repository.interface";
import { IWishlistRepository } from "#/domain/repositories/wishlist.repository.interface";
import { RemoveProductFromWishlistCommand } from "../commands/remove-product-from-wishlist.command";
import { Wishlist } from "#/domain/entities/wishlist/wishlist.entity";

@CommandHandler(RemoveProductFromWishlistCommand)
export class RemoveProductFromWishlistHandler
  implements ICommandHandler<RemoveProductFromWishlistCommand>
{
  constructor(
    @Inject(WISHLIST_REPOSITORY)
    private readonly wishlistRepository: IWishlistRepository,
  ) {}

  async execute(command: RemoveProductFromWishlistCommand): Promise<Wishlist> {
    const { userId, productId } = command;
    return this.wishlistRepository.removeProduct(userId, productId);
  }
}
