import { User } from "./user.entity";
import { Product } from "./product.entity";

export class Review {
  private constructor(
    public readonly id: number | undefined,
    public readonly rating: number,
    public readonly comment: string,
    public readonly user: User,
    public readonly product: Product,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    rating: number,
    comment: string,
    user: User,
    product: Product,
  ): Review {
    return new Review(
      undefined,
      rating,
      comment,
      user,
      product,
      new Date(),
      new Date(),
    );
  }

  static fromPersistence(data: any, user: User, product: Product): Review {
    return new Review(
      data.id,
      data.rating,
      data.comment,
      user,
      product,
      data.createdAt,
      data.updatedAt,
    );
  }
}
