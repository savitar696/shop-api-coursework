import { Product } from "../entities/product.entity";

export interface FindAllProductsOptions {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "name" | "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
  skip?: number;
  take?: number;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
}

export interface SearchProductsOptions {
  skip?: number;
  take?: number;
}

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findAll(options: FindAllProductsOptions): Promise<PaginatedProducts>;
  findTopRated(limit: number): Promise<Product[]>;
  findNewest(limit: number): Promise<Product[]>;

  search(
    query: string,
    options: SearchProductsOptions,
  ): Promise<PaginatedProducts>;
  updateRating(productId: number, newRating: number): Promise<void>;
}
