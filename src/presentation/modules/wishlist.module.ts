import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "#/infrastructure/prisma/prisma.module";
import { AuthModule } from "./auth.module";
import { ProductModule } from "./product.module";

import { WishlistController } from "#/presentation/controllers/wishlist.controller";
import { WISHLIST_REPOSITORY } from "#/domain/repositories/wishlist.repository.interface";
import { PrismaWishlistRepository } from "#/infrastructure/repositories/prisma/wishlist.repository";
import { GetWishlistHandler } from "#/application/wishlist/handlers/get-wishlist.handler";
import { AddProductToWishlistHandler } from "#/application/wishlist/handlers/add-product-to-wishlist.handler";
import { RemoveProductFromWishlistHandler } from "#/application/wishlist/handlers/remove-product-from-wishlist.handler";

export const WishlistQueryHandlers = [GetWishlistHandler];
export const WishlistCommandHandlers = [
  AddProductToWishlistHandler,
  RemoveProductFromWishlistHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule, AuthModule, ProductModule],
  controllers: [WishlistController],
  providers: [
    {
      provide: WISHLIST_REPOSITORY,
      useClass: PrismaWishlistRepository,
    },
    ...WishlistQueryHandlers,
    ...WishlistCommandHandlers,
  ],
})
export class WishlistModule {}
