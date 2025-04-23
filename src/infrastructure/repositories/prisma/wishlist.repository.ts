import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "#/infrastructure/prisma/prisma.service";
import { IWishlistRepository } from "#/domain/repositories/wishlist.repository.interface";
import { Wishlist } from "#/domain/entities/wishlist/wishlist.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaWishlistRepository implements IWishlistRepository {
  constructor(private readonly prisma: PrismaService) {}

  private wishlistInclude = { items: { include: { product: true } } };

  private mapToDomain(
    prismaWishlist: Prisma.WishlistGetPayload<{
      include: typeof this.wishlistInclude;
    }>,
  ): Wishlist {
    return Wishlist.fromPersistence(prismaWishlist);
  }

  async findByUserId(userId: number): Promise<Wishlist | null> {
    const prismaWishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: this.wishlistInclude,
    });
    return prismaWishlist ? this.mapToDomain(prismaWishlist as any) : null;
  }

  async create(userId: number): Promise<Wishlist> {
    const prismaWishlist = await this.prisma.wishlist.create({
      data: { userId },
      include: this.wishlistInclude,
    });
    return this.mapToDomain(prismaWishlist as any);
  }

  private async getOrCreateWishlist(
    userId: number,
  ): Promise<
    Prisma.WishlistGetPayload<{ include: typeof this.wishlistInclude }>
  > {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: this.wishlistInclude,
    });
    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
        include: this.wishlistInclude,
      });
    }
    return wishlist as any;
  }

  async addProduct(userId: number, productId: number): Promise<Wishlist> {
    const productExists = await this.prisma.product.count({
      where: { id: productId },
    });
    if (!productExists) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const wishlist = await this.getOrCreateWishlist(userId);

    const updatedWishlist = await this.prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        items: {
          connectOrCreate: {
            where: {
              wishlistId_productId: {
                wishlistId: wishlist.id,
                productId: productId,
              },
            },
            create: { productId: productId },
          },
        },
      },
      include: this.wishlistInclude,
    });

    return this.mapToDomain(updatedWishlist as any);
  }

  async removeProduct(userId: number, productId: number): Promise<Wishlist> {
    const wishlist = await this.getOrCreateWishlist(userId);

    const updatedWishlist = await this.prisma.wishlist.update({
      where: { id: wishlist.id },
      data: {
        items: {
          delete: {
            wishlistId_productId: {
              wishlistId: wishlist.id,
              productId: productId,
            },
          },
        },
      },
      include: this.wishlistInclude,
    });

    return this.mapToDomain(updatedWishlist as any);
  }
}
