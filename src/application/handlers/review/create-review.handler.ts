import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException, Inject } from "@nestjs/common";

import { CreateReviewCommand } from "#/application/commands/review/create-review.command";
import {
  REVIEW_REPOSITORY,
  USER_REPOSITORY,
  PRODUCT_REPOSITORY,
} from "#/domain/repositories/tokens";
import { IReviewRepository } from "#/domain/repositories/review.repository.interface";
import { IUserRepository } from "#/domain/repositories/user.repository.interface";
import { IProductRepository } from "#/domain/repositories/product.repository.interface";
import { Review } from "#/domain/entities/review.entity";

@CommandHandler(CreateReviewCommand)
export class CreateReviewHandler
  implements ICommandHandler<CreateReviewCommand>
{
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: IReviewRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: CreateReviewCommand): Promise<Review> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const product = await this.productRepository.findById(command.productId);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const review = Review.create(
      command.rating,
      command.comment,
      user,
      product,
    );

    const createdReview = await this.reviewRepository.create(review);
    const averageRating = await this.reviewRepository.calculateAverageRating(
      command.productId,
    );

    await this.productRepository.updateRating(command.productId, averageRating);

    return createdReview;
  }
}
