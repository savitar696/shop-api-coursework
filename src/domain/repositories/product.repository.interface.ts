import { Product } from '../entities/product.entity';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findTopRated(limit: number): Promise<Product[]>;
  updateRating(productId: number, newRating: number): Promise<void>;
}
