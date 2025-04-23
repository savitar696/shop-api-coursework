import { Category } from "#/domain/entities/category.entity";

export const CATEGORY_REPOSITORY = Symbol("ICategoryRepository");

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
}
