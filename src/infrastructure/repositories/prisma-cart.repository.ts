import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "#/infrastructure/prisma/prisma.service";
import { ICartRepository } from "#/domain/repositories/cart.repository";
import { Cart } from "#/domain/entities/cart/cart.entity";
import { CartItem } from "#/domain/entities/cart/cart-item.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(
    prismaCart: Prisma.CartGetPayload<{ include: { items: true } }>,
  ): Cart {
    const items = prismaCart.items.map(
      (item) =>
        new CartItem(
          item.id,
          item.cartId,
          item.productId,
          item.quantity,
          item.price,
        ),
    );
    return new Cart(
      prismaCart.id,
      prismaCart.userId,
      items,
      prismaCart.createdAt,
      prismaCart.updatedAt,
    );
  }

  async findByUserId(userId: number): Promise<Cart | null> {
    const prismaCart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    return prismaCart ? this.mapToDomain(prismaCart) : null;
  }

  async create(userId: number): Promise<Cart> {
    const prismaCart = await this.prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
    return this.mapToDomain(prismaCart);
  }

  async save(cart: Cart): Promise<Cart> {
    const { id, userId, items, createdAt, updatedAt } = cart;

    const cartData: Prisma.CartUpdateInput | Prisma.CartCreateInput = {
      user: { connect: { id: userId } },
      createdAt: createdAt,
      updatedAt: updatedAt,
      items: {
        deleteMany: { cartId: id },
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    const prismaCart = await this.prisma.cart.upsert({
      where: { id: id ?? -1 },
      create: { userId, items: (cartData as any).items },
      update: cartData as Prisma.CartUpdateInput,
      include: { items: true },
    });

    return this.mapToDomain(prismaCart);
  }
}
