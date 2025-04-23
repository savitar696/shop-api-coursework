import { Injectable } from "@nestjs/common";
import { PrismaService } from "#/infrastructure/prisma/prisma.service";
import { IOrderRepository } from "#/domain/repositories/order.repository";
import {
  Order,
  OrderStatus as DomainOrderStatus,
} from "#/domain/entities/order/order.entity";
import { OrderItem } from "#/domain/entities/order/order-item.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(
    prismaOrder: Prisma.OrderGetPayload<{ include: { items: true } }>,
  ): Order {
    const items = prismaOrder.items.map(OrderItem.fromPersistence);
    return new Order(
      prismaOrder.id,
      prismaOrder.userId,
      prismaOrder.totalAmount,
      DomainOrderStatus[prismaOrder.status],
      prismaOrder.createdAt,
      prismaOrder.updatedAt,
      items,
      prismaOrder.shippingAddress,
    );
  }

  async findById(id: number): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return prismaOrder ? this.mapToDomain(prismaOrder) : null;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const prismaOrders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return prismaOrders.map(this.mapToDomain);
  }

  async save(order: Order): Promise<Order> {
    const {
      id,
      userId,
      totalAmount,
      status,
      createdAt,
      updatedAt,
      shippingAddress,
      items,
    } = order;

    const itemsData = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderData:
      | (Omit<Prisma.OrderUpdateInput, "items"> & {
          items?: Prisma.OrderItemUpdateManyWithoutOrderNestedInput;
        })
      | (Omit<Prisma.OrderCreateInput, "items"> & {
          items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
        }) = {
      user: { connect: { id: userId } },
      totalAmount: totalAmount,
      status: status,
      shippingAddress: shippingAddress,
      createdAt: createdAt,
      updatedAt: updatedAt,
      items: {
        deleteMany: { orderId: id ?? -1 },
        create: itemsData,
      },
    };

    const prismaOrder = await this.prisma.order.upsert({
      where: { id: id ?? -1 },
      create: {
        userId,
        totalAmount,
        status,
        shippingAddress,
        items: { create: itemsData },
      },
      update: orderData as Prisma.OrderUpdateInput,
      include: { items: true },
    });

    return this.mapToDomain(prismaOrder);
  }
}
