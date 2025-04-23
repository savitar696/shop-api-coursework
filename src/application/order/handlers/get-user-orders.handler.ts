import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { IOrderRepository } from "#/domain/repositories/order.repository";
import { GetUserOrdersQuery } from "../queries/get-user-orders.query";
import { OrderDto } from "../dtos/order.dto";

@QueryHandler(GetUserOrdersQuery)
export class GetUserOrdersHandler implements IQueryHandler<GetUserOrdersQuery> {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: GetUserOrdersQuery): Promise<OrderDto[]> {
    const { userId } = query;

    const orders = await this.orderRepository.findByUserId(userId);

    return orders.map(OrderDto.fromEntity);
  }
}
