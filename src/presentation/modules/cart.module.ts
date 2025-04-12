import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '#/infrastructure/prisma/prisma.module';
import { CartController } from '#/presentation/controllers/cart.controller';
import { ICartRepository } from '#/domain/repositories/cart.repository';
import { PrismaCartRepository } from '#/infrastructure/repositories/prisma-cart.repository';
import { AddItemToCartHandler } from '#/application/cart/handlers/add-item-to-cart.handler';
import { GetCartHandler } from '#/application/cart/handlers/get-cart.handler';
import { RemoveItemFromCartHandler } from '#/application/cart/handlers/remove-item-from-cart.handler';
import { UpdateCartItemQuantityHandler } from '#/application/cart/handlers/update-cart-item-quantity.handler';
import { ProductModule } from './product.module';

export const CartCommandHandlers = [
  AddItemToCartHandler,
  RemoveItemFromCartHandler,
  UpdateCartItemQuantityHandler,
];
export const CartQueryHandlers = [GetCartHandler];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    ProductModule,
  ],
  controllers: [CartController],
  providers: [
    {
      provide: ICartRepository,
      useClass: PrismaCartRepository,
    },
    ...CartCommandHandlers,
    ...CartQueryHandlers,
  ],
  exports: [ICartRepository],
})
export class CartModule {}
