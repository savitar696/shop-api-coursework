import { Cart } from '../entities/cart/cart.entity';

export const ICartRepository = Symbol('ICartRepository');

export interface ICartRepository {
  findByUserId(userId: number): Promise<Cart | null>;
  create(userId: number): Promise<Cart>;
  save(cart: Cart): Promise<Cart>;
}
