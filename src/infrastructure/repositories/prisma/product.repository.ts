import { Injectable } from "@nestjs/common";
import { PrismaService } from "#/infrastructure/prisma/prisma.service";
import {
  IProductRepository,
  FindAllProductsOptions,
  PaginatedProducts,
  SearchProductsOptions,
} from "#/domain/repositories/product.repository.interface";
import { Product } from "#/domain/entities/product.entity";
import { Prisma } from "@prisma/client";

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
        category: { connect: { id: product.categoryId } },
      },
      include: { category: true },
    });
    return Product.fromPersistence(createdProduct);
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    return product ? Product.fromPersistence(product) : null;
  }

  async findAll(options: FindAllProductsOptions): Promise<PaginatedProducts> {
    const { categoryId, minPrice, maxPrice, sortBy, sortOrder, skip, take } =
      options;

    const whereClause: Prisma.ProductWhereInput = {};
    if (categoryId !== undefined) {
      whereClause.categoryId = categoryId;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) {
        whereClause.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.price.lte = maxPrice;
      }
    }

    const orderByClause: Prisma.ProductOrderByWithRelationInput = {};
    if (sortBy) {
      orderByClause[sortBy] = sortOrder ?? "asc";
    } else {
      orderByClause.createdAt = "desc";
    }

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: orderByClause,
      skip: skip,
      take: take,
    });

    const total = await this.prisma.product.count({
      where: whereClause,
    });

    return {
      data: products.map(Product.fromPersistence),
      total: total,
    };
  }

  async findTopRated(limit: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { rating: "desc" },
      take: limit,
      include: { category: true },
    });
    return products.map((product) => Product.fromPersistence(product));
  }

  async findNewest(limit: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { category: true },
    });
    return products.map(Product.fromPersistence);
  }

  async search(
    query: string,
    options: SearchProductsOptions,
  ): Promise<PaginatedProducts> {
    const { skip, take } = options;
    const searchQuery = query.trim();

    if (!searchQuery) {
      return { data: [], total: 0 };
    }

    const whereClause: Prisma.ProductWhereInput = {
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: take,
    });

    const total = await this.prisma.product.count({
      where: whereClause,
    });

    return {
      data: products.map(Product.fromPersistence),
      total: total,
    };
  }

  async updateRating(productId: number, newRating: number): Promise<void> {
    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: newRating },
    });
  }
}
