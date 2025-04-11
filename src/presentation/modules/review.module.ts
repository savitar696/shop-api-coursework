import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ReviewController } from '#/presentation/controllers/review.controller';
import { CreateReviewHandler } from '#/application/handlers/review/create-review.handler';
import { PrismaReviewRepository } from '#/infrastructure/repositories/prisma/review.repository';
import { PrismaUserRepository } from '#/infrastructure/repositories/prisma/user.repository';
import { PrismaProductRepository } from '#/infrastructure/repositories/prisma/product.repository';
import { REVIEW_REPOSITORY, USER_REPOSITORY, PRODUCT_REPOSITORY } from '#/domain/repositories/tokens';

const handlers = [
  CreateReviewHandler,
];

const providers = [
  {
    provide: REVIEW_REPOSITORY,
    useClass: PrismaReviewRepository,
  },
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
  {
    provide: PRODUCT_REPOSITORY,
    useClass: PrismaProductRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
  ],
  controllers: [ReviewController],
  providers: [...handlers, ...providers],
  exports: [REVIEW_REPOSITORY, USER_REPOSITORY, PRODUCT_REPOSITORY],
})
export class ReviewModule {}
