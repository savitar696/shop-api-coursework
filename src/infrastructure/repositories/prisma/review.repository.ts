import { Injectable } from "@nestjs/common";
import { PrismaService } from "#/infrastructure/prisma/prisma.service";
import { IReviewRepository } from "#/domain/repositories/review.repository.interface";
import { Review } from "#/domain/entities/review.entity";
import { User } from "#/domain/entities/user.entity";
import { Product } from "#/domain/entities/product.entity";

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(review: Review): Promise<Review> {
    const createdReview = await this.prisma.review.create({
      data: {
        rating: review.rating,
        comment: review.comment,
        userId: review.user.id!,
        productId: review.product.id!,
      },
      include: {
        user: true,
        product: true,
      },
    });

    const user = User.fromPersistence(createdReview.user);
    const product = Product.fromPersistence(createdReview.product);
    return Review.fromPersistence(createdReview, user, product);
  }

  async findByProductId(productId: number): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: true,
        product: true,
      },
    });

    return reviews.map((review) => {
      const user = User.fromPersistence(review.user);
      const product = Product.fromPersistence(review.product);
      return Review.fromPersistence(review, user, product);
    });
  }

  async findByUserId(userId: number): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { userId },
      include: {
        user: true,
        product: true,
      },
    });

    return reviews.map((review) => {
      const user = User.fromPersistence(review.user);
      const product = Product.fromPersistence(review.product);
      return Review.fromPersistence(review, user, product);
    });
  }

  async calculateAverageRating(productId: number): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: {
        rating: true,
      },
    });

    return result._avg.rating || 0;
  }
}
