import { Category } from "./category.entity";

export class Product {
  private constructor(
    public readonly id: number | undefined,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly image: string | null,
    public readonly rating: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly categoryId: number,
    public readonly category?: Category,
  ) {}

  static create(
    name: string,
    description: string,
    price: number,
    categoryId: number,
    image?: string,
  ): Product {
    return new Product(
      undefined,
      name,
      description,
      price,
      image || null,
      0,
      new Date(),
      new Date(),
      categoryId,
    );
  }

  static fromPersistence(data: any): Product {
    return new Product(
      data.id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.rating,
      data.createdAt,
      data.updatedAt,
      data.categoryId,
      data.category ? Category.fromPersistence(data.category) : undefined,
    );
  }

  updateRating(newRating: number): void {
    (this as any).rating = newRating;
  }
}
