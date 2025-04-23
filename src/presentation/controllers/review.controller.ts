import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Inject,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "#/presentation/guards/jwt-auth.guard";
import { CreateReviewCommand } from "#/application/commands/review/create-review.command";
import { REVIEW_REPOSITORY } from "#/domain/repositories/tokens";
import { IReviewRepository } from "#/domain/repositories/review.repository.interface";
import { IsInt, IsString, Min, Max } from "class-validator";
import { User as UserEntity } from "#/domain/entities/user.entity";
import { User as RequestUser } from "#/presentation/decorators/user.decorator";
import { Review } from "#/domain/entities/review.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiProperty,
} from "@nestjs/swagger";

export class CreateReviewDto {
  @ApiProperty({ description: "Рейтинг (от 1 до 5)", minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: "Текст отзыва" })
  @IsString()
  comment: string;

  @ApiProperty({ description: "ID продукта, к которому относится отзыв" })
  @IsInt()
  productId: number;
}

export class ReviewDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  rating: number;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({ description: "ID пользователя, оставившего отзыв" })
  userId: number;
  @ApiProperty({ description: "ID продукта" })
  productId: number;

  static fromEntity(entity: Review): ReviewDto {
    const dto = new ReviewDto();
    Object.assign(dto, entity);
    return dto;
  }
}

@ApiTags("Reviews")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("reviews")
export class ReviewController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(REVIEW_REPOSITORY)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Создать новый отзыв к продукту" })
  @ApiResponse({
    status: 201,
    description: "Отзыв успешно создан",
    type: ReviewDto,
  })
  @ApiResponse({ status: 400, description: "Ошибка валидации" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBody({ type: CreateReviewDto })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @RequestUser() user: UserEntity,
  ): Promise<ReviewDto> {
    const review = await this.commandBus.execute(
      new CreateReviewCommand(
        user.id!,
        createReviewDto.productId,
        createReviewDto.rating,
        createReviewDto.comment,
      ),
    );
    return ReviewDto.fromEntity(review);
  }

  @Get("product/:productId")
  @ApiOperation({ summary: "Получить все отзывы для продукта" })
  @ApiParam({ name: "productId", description: "ID продукта", type: Number })
  @ApiResponse({
    status: 200,
    description: "Список отзывов",
    type: [ReviewDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 404,
    description: "Продукт не найден или неверный ID",
  })
  async findByProductId(
    @Param("productId", ParseIntPipe) productId: number,
  ): Promise<ReviewDto[]> {
    const reviews = await this.reviewRepository.findByProductId(productId);
    return reviews.map(ReviewDto.fromEntity);
  }
}
