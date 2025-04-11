import { Controller, Post, Body, UseGuards, Get, Param, Inject, ParseIntPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '#/presentation/guards/jwt-auth.guard';
import { CreateReviewCommand } from '#/application/commands/review/create-review.command';
import { REVIEW_REPOSITORY } from '#/domain/repositories/tokens';
import { IReviewRepository } from '#/domain/repositories/review.repository.interface';
import { IsInt, IsString, Min, Max } from 'class-validator';
import { User as UserEntity } from '#/domain/entities/user.entity';
import { User as RequestUser } from '#/presentation/decorators/user.decorator';
import { Review } from '#/domain/entities/review.entity';

class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;

  @IsInt()
  productId: number;
}

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @RequestUser() user: UserEntity
  ): Promise<Review> {
    return this.commandBus.execute(
      new CreateReviewCommand(
        user.id!,
        createReviewDto.productId,
        createReviewDto.rating,
        createReviewDto.comment,
      ),
    );
  }

  @Get('product/:productId')
  async findByProductId(
    @Param('productId', ParseIntPipe) productId: number
  ): Promise<Review[]> {
    const reviews = await this.reviewRepository.findByProductId(productId);
    if (!reviews.length) {
        // Можно вернуть пустой массив или NotFoundException, в зависимости от требований
        // throw new NotFoundException(`No reviews found for product ID ${productId}`);
    }
    return reviews;
  }
}
