import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Body,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "#/presentation/guards/jwt-auth.guard";
import { RequestWithUser } from "#/presentation/interfaces/request-with-user.interface";
import { OrderDto } from "#/application/order/dtos/order.dto";
import { CreateOrderDto } from "#/application/order/dtos/create-order.dto";
import { CreateOrderCommand } from "#/application/order/commands/create-order.command";
import { GetOrderQuery } from "#/application/order/queries/get-order.query";
import { GetUserOrdersQuery } from "#/application/order/queries/get-user-orders.query";

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Создать заказ из корзины текущего пользователя" })
  @ApiResponse({
    status: 201,
    description: "Заказ успешно создан",
    type: OrderDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request (Cart is empty, Validation Error)",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createOrder(
    @Req() req: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    const userId = req.user.id;
    const order = await this.commandBus.execute(
      new CreateOrderCommand(userId, createOrderDto.shippingAddress),
    );
    return OrderDto.fromEntity(order);
  }

  @Get()
  @ApiOperation({ summary: "Получить список заказов текущего пользователя" })
  @ApiResponse({ status: 200, description: "Список заказов", type: [OrderDto] })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getUserOrders(@Req() req: RequestWithUser): Promise<OrderDto[]> {
    const userId = req.user.id;
    return this.queryBus.execute(new GetUserOrdersQuery(userId));
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить заказ по ID" })
  @ApiResponse({ status: 200, description: "Данные заказа", type: OrderDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden (Access Denied)" })
  @ApiResponse({ status: 404, description: "Order not found" })
  async getOrderById(
    @Req() req: RequestWithUser,
    @Param("id", ParseIntPipe) orderId: number,
  ): Promise<OrderDto> {
    const userId = req.user.id;
    return this.queryBus.execute(new GetOrderQuery(orderId, userId));
  }
}
