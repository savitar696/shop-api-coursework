import { Injectable } from '@nestjs/common';
import { PrismaService } from '#/infrastructure/prisma/prisma.service';
import { IOrderRepository } from '#/domain/repositories/order.repository';
import { Order, OrderStatus as DomainOrderStatus } from '#/domain/entities/order/order.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Добавить маппинг OrderItem, если используется
  private mapToDomain(prismaOrder: Prisma.OrderGetPayload<{ include: { items: { include: { product: true } } } }>): Order {
    // const items = prismaOrder.items.map(item => ...);
    return new Order(
      prismaOrder.id,
      prismaOrder.userId,
      prismaOrder.totalAmount,
      DomainOrderStatus[prismaOrder.status],
      prismaOrder.createdAt,
      prismaOrder.updatedAt,
      prismaOrder.shippingAddress,
      // items,
    );
  }

  async findById(id: number): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }, // Включаем элементы и продукты в них
    });
    return prismaOrder ? this.mapToDomain(prismaOrder) : null;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const prismaOrders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }, // Сортируем по убыванию даты создания
    });
    return prismaOrders.map(this.mapToDomain);
  }

  async save(order: Order): Promise<Order> {
    const { id, userId, totalAmount, status, createdAt, updatedAt, shippingAddress } = order;
    // const itemsData = order.items.map(item => ({...})); // TODO: Подготовить данные для OrderItem

    const orderData: Prisma.OrderUpdateInput | Prisma.OrderCreateInput = {
      user: { connect: { id: userId } },
      totalAmount: totalAmount,
      status: status,
      shippingAddress: shippingAddress,
      createdAt: createdAt,
      updatedAt: updatedAt, // Prisma обновит автоматически при update
      items: { // TODO: Реализовать сохранение OrderItem
        // deleteMany: { orderId: id },
        // create: itemsData,
      },
    };

    const prismaOrder = await this.prisma.order.upsert({
      where: { id: id ?? -1 },
      create: {
        userId,
        totalAmount,
        status: status,
        shippingAddress,
        items: (orderData as any).items, // TODO: Проверить/исправить
      },
      update: orderData as Prisma.OrderUpdateInput,
      include: { items: { include: { product: true } } },
    });

    return this.mapToDomain(prismaOrder);
  }
}
