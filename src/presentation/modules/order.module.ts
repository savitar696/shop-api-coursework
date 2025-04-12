import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '#/infrastructure/prisma/prisma.module';
import { OrderController } from '#/presentation/controllers/order.controller';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { PrismaOrderRepository } from '#/infrastructure/repositories/prisma-order.repository';
import { CreateOrderHandler } from '#/application/order/handlers/create-order.handler';
import { GetOrderHandler } from '#/application/order/handlers/get-order.handler';
import { GetUserOrdersHandler } from '#/application/order/handlers/get-user-orders.handler';
import { AuthModule } from './auth.module'; // Нужен для JwtAuthGuard
import { CartModule } from './cart.module'; // Нужен для ICartRepository в CreateOrderHandler
import { ICartRepository } from '#/domain/repositories/cart.repository'; // Импортируем токен
// import { PrismaCartRepository } from '#/infrastructure/repositories/prisma-cart.repository'; // Реализация не нужна здесь, т.к. она в CartModule

export const OrderCommandHandlers = [CreateOrderHandler];
export const OrderQueryHandlers = [GetOrderHandler, GetUserOrdersHandler];

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    AuthModule, // Импортируем AuthModule для использования Guards
    CartModule, // Импортируем CartModule, чтобы получить доступ к ICartRepository
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: IOrderRepository,
      useClass: PrismaOrderRepository,
    },
    // ICartRepository будет предоставлен через CartModule
    ...OrderCommandHandlers,
    ...OrderQueryHandlers,
  ],
})
export class OrderModule {}
