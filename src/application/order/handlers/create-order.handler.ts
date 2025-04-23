import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException, BadRequestException } from "@nestjs/common";
import { ICartRepository } from "#/domain/repositories/cart.repository";
import { IOrderRepository } from "#/domain/repositories/order.repository";
import { CreateOrderCommand } from "../commands/create-order.command";
import { Order, OrderStatus } from "#/domain/entities/order/order.entity";
import { OrderItem } from "#/domain/entities/order/order-item.entity";
import { Cart } from "#/domain/entities/cart/cart.entity";

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ICartRepository) private readonly cartRepository: ICartRepository,
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const { userId, shippingAddress } = command;

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const orderItems = cart.items.map(
      (cartItem) =>
        new OrderItem(
          Date.now() + Math.random(),
          -1,
          cartItem.productId,
          cartItem.quantity,
          cartItem.price,
        ),
    );

    const pseudoId = Date.now();
    const now = new Date();
    const order = new Order(
      pseudoId,
      userId,
      totalAmount,
      OrderStatus.PENDING,
      now,
      now,
      orderItems,
      shippingAddress,
    );

    const savedOrder = await this.orderRepository.save(order);

    cart.items = [];
    await this.cartRepository.save(cart);

    return savedOrder;
  }
}
