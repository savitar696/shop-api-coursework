import { Review } from "../entities/review.entity";

export interface IReviewRepository {
  create(review: Review): Promise<Review>;
  findByProductId(productId: number): Promise<Review[]>;
  findByUserId(userId: number): Promise<Review[]>;
  calculateAverageRating(productId: number): Promise<number>;
}
