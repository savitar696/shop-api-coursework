import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { WISHLIST_REPOSITORY } from "#/domain/repositories/wishlist.repository.interface";
import { IWishlistRepository } from "#/domain/repositories/wishlist.repository.interface";
import { GetWishlistQuery } from "../queries/get-wishlist.query";
import { WishlistDto } from "../dtos/wishlist.dto";

@QueryHandler(GetWishlistQuery)
export class GetWishlistHandler implements IQueryHandler<GetWishlistQuery> {
  constructor(
    @Inject(WISHLIST_REPOSITORY)
    private readonly wishlistRepository: IWishlistRepository,
  ) {}

  async execute(query: GetWishlistQuery): Promise<WishlistDto> {
    const { userId } = query;
    let wishlist = await this.wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      wishlist = await this.wishlistRepository.create(userId);
    }

    return WishlistDto.fromEntity(wishlist);
  }
}
