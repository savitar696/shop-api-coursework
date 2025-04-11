import { Module } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { PrismaProductRepository } from '#/infrastructure/repositories/prisma/product.repository';
import { PRODUCT_REPOSITORY } from '#/domain/repositories/tokens';

const providers = [
  {
    provide: PRODUCT_REPOSITORY,
    useClass: PrismaProductRepository,
  },
];

@Module({
  controllers: [ProductController],
  providers: [...providers],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}
