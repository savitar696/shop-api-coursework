import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaModule } from "#/infrastructure/prisma/prisma.module";
import { OrderController } from "#/presentation/controllers/order.controller";
import { IOrderRepository } from "#/domain/repositories/order.repository";
import { PrismaOrderRepository } from "#/infrastructure/repositories/prisma-order.repository";
import { CreateOrderHandler } from "#/application/order/handlers/create-order.handler";
import { GetOrderHandler } from "#/application/order/handlers/get-order.handler";
import { GetUserOrdersHandler } from "#/application/order/handlers/get-user-orders.handler";
import { AuthModule } from "./auth.module";
import { CartModule } from "./cart.module";
import { ICartRepository } from "#/domain/repositories/cart.repository";

export const OrderCommandHandlers = [CreateOrderHandler];
export const OrderQueryHandlers = [GetOrderHandler, GetUserOrdersHandler];

@Module({
  imports: [CqrsModule, PrismaModule, AuthModule, CartModule],
  controllers: [OrderController],
  providers: [
    {
      provide: IOrderRepository,
      useClass: PrismaOrderRepository,
    },

    ...OrderCommandHandlers,
    ...OrderQueryHandlers,
  ],
})
export class OrderModule {}
