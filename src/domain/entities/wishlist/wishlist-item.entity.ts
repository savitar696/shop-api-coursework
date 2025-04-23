import { Product } from "#/domain/entities/product.entity";

export class WishlistItem {
  id: number;
  wishlistId: number;
  productId: number;
  addedAt: Date;
  product?: Product;

  constructor(
    id: number,
    wishlistId: number,
    productId: number,
    addedAt: Date,
    product?: Product,
  ) {
    this.id = id;
    this.wishlistId = wishlistId;
    this.productId = productId;
    this.addedAt = addedAt;
    this.product = product;
  }

  static fromPersistence(data: any): WishlistItem {
    return new WishlistItem(
      data.id,
      data.wishlistId,
      data.productId,
      data.addedAt,
      data.product ? Product.fromPersistence(data.product) : undefined,
    );
  }
}
