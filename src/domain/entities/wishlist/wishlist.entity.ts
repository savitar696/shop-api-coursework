import { WishlistItem } from "./wishlist-item.entity";

export class Wishlist {
  id: number;
  userId: number;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    userId: number,
    items: WishlistItem[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(data: any): Wishlist {
    const items = data.items?.map(WishlistItem.fromPersistence) ?? [];
    return new Wishlist(
      data.id,
      data.userId,
      items,
      data.createdAt,
      data.updatedAt,
    );
  }
}
