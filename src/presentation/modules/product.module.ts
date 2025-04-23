import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ProductController } from "../controllers/product.controller";
import { PrismaProductRepository } from "#/infrastructure/repositories/prisma/product.repository";
import { PRODUCT_REPOSITORY } from "#/domain/repositories/tokens";
import { GetProductsHandler } from "#/application/products/handlers/get-products.handler";
import { SearchProductsHandler } from "#/application/products/handlers/search-products.handler";

export const ProductQueryHandlers = [GetProductsHandler, SearchProductsHandler];

const providers = [
  {
    provide: PRODUCT_REPOSITORY,
    useClass: PrismaProductRepository,
  },
  ...ProductQueryHandlers,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [...providers],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}
