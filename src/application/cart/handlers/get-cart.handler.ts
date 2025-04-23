import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ICartRepository } from "#/domain/repositories/cart.repository";
import { GetCartQuery } from "../queries/get-cart.query";
import { CartDto } from "../dtos/cart.dto";

@QueryHandler(GetCartQuery)
export class GetCartHandler implements IQueryHandler<GetCartQuery> {
  constructor(
    @Inject(ICartRepository) private readonly cartRepository: ICartRepository,
  ) {}

  async execute(query: GetCartQuery): Promise<CartDto> {
    const { userId } = query;
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      return {
        id: 0,
        userId: userId,
        items: [],
        total: 0,
      };
    }

    return CartDto.fromEntity(cart);
  }
}
