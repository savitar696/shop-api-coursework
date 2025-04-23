import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException, ForbiddenException } from "@nestjs/common";
import { IOrderRepository } from "#/domain/repositories/order.repository";
import { GetOrderQuery } from "../queries/get-order.query";
import { OrderDto } from "../dtos/order.dto";

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<OrderDto> {
    const { orderId, userId } = query;

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (userId && order.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return OrderDto.fromEntity(order);
  }
}
