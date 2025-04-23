import { Injectable } from "@nestjs/common";
import { PrismaService } from "#/infrastructure/prisma/prisma.service";
import { ICategoryRepository } from "#/domain/repositories/category.repository.interface";
import { Category } from "#/domain/entities/category.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(prismaCategory: Prisma.CategoryGetPayload<{}>): Category {
    return Category.fromPersistence(prismaCategory);
  }

  async findAll(): Promise<Category[]> {
    const prismaCategories = await this.prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return prismaCategories.map(this.mapToDomain);
  }

  async findById(id: number): Promise<Category | null> {
    const prismaCategory = await this.prisma.category.findUnique({
      where: { id },
    });
    return prismaCategory ? this.mapToDomain(prismaCategory) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const prismaCategory = await this.prisma.category.findUnique({
      where: { slug },
    });
    return prismaCategory ? this.mapToDomain(prismaCategory) : null;
  }
}
