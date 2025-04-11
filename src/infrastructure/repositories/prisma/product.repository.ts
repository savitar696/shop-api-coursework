import { Injectable } from '@nestjs/common';
import { PrismaService } from '#/infrastructure/prisma/prisma.service';
import { IProductRepository } from '#/domain/repositories/product.repository.interface';
import { Product } from '#/domain/entities/product.entity';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Product): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        rating: product.rating,
      },
    });
    return Product.fromPersistence(createdProduct);
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? Product.fromPersistence(product) : null;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map(product => Product.fromPersistence(product));
  }

  async findTopRated(limit: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { rating: 'desc' },
      take: limit,
    });
    return products.map(product => Product.fromPersistence(product));
  }

  async updateRating(productId: number, newRating: number): Promise<void> {
    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: newRating },
    });
  }
}
