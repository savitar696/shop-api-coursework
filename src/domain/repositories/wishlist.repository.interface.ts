import { Wishlist } from "#/domain/entities/wishlist/wishlist.entity";

export const WISHLIST_REPOSITORY = Symbol("IWishlistRepository");

export interface IWishlistRepository {
  findByUserId(userId: number): Promise<Wishlist | null>;
  create(userId: number): Promise<Wishlist>;
  addProduct(userId: number, productId: number): Promise<Wishlist>;
  removeProduct(userId: number, productId: number): Promise<Wishlist>;
}
