import { Order } from "../entities/order/order.entity";

export const IOrderRepository = Symbol("IOrderRepository");

export interface IOrderRepository {
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: number): Promise<Order[]>;
  save(order: Order): Promise<Order>;
}
