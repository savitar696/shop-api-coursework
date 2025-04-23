import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
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

import { AddItemToCartDto } from "#/application/cart/dtos/add-item-to-cart.dto";
import { RemoveItemFromCartDto } from "#/application/cart/dtos/remove-item-from-cart.dto";
import { UpdateCartItemQuantityDto } from "#/application/cart/dtos/update-cart-item-quantity.dto";
import { CartDto } from "#/application/cart/dtos/cart.dto";

import { AddItemToCartCommand } from "#/application/cart/commands/add-item-to-cart.command";
import { GetCartQuery } from "#/application/cart/queries/get-cart.query";
import { RemoveItemFromCartCommand } from "#/application/cart/commands/remove-item-from-cart.command";
import { UpdateCartItemQuantityCommand } from "#/application/cart/commands/update-cart-item-quantity.command";

@ApiTags("Cart")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("cart")
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: "Получить корзину текущего пользователя" })
  @ApiResponse({
    status: 200,
    description: "Корзина пользователя",
    type: CartDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getCart(@Req() req: RequestWithUser): Promise<CartDto> {
    const userId = req.user.id;
    return this.queryBus.execute(new GetCartQuery(userId));
  }

  @Post("items")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Добавить товар в корзину" })
  @ApiResponse({
    status: 200,
    description: "Обновленная корзина",
    type: CartDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request (Validation Error)" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async addItem(
    @Req() req: RequestWithUser,
    @Body() addItemDto: AddItemToCartDto,
  ): Promise<CartDto> {
    const userId = req.user.id;
    await this.commandBus.execute(
      new AddItemToCartCommand(
        userId,
        addItemDto.productId,
        addItemDto.quantity,
      ),
    );

    return this.queryBus.execute(new GetCartQuery(userId));
  }

  @Delete("items/:productId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Удалить товар из корзины" })
  @ApiResponse({
    status: 200,
    description: "Обновленная корзина",
    type: CartDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 404,
    description: "Cart or Product not found in cart",
  })
  async removeItem(
    @Req() req: RequestWithUser,
    @Param("productId", ParseIntPipe) productId: number,
  ): Promise<CartDto> {
    const userId = req.user.id;
    await this.commandBus.execute(
      new RemoveItemFromCartCommand(userId, productId),
    );
    return this.queryBus.execute(new GetCartQuery(userId));
  }

  /*
  @Delete('items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить товар из корзины (productId в теле)' })

  async removeItemFromBody(
    @Req() req: RequestWithUser,
    @Body() removeItemDto: RemoveItemFromCartDto,
  ): Promise<CartDto> {
    const userId = req.user.sub;
    await this.commandBus.execute(
      new RemoveItemFromCartCommand(userId, removeItemDto.productId),
    );
    return this.queryBus.execute(new GetCartQuery(userId));
  }
  */

  @Patch("items/:productId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Изменить количество товара в корзине" })
  @ApiResponse({
    status: 200,
    description: "Обновленная корзина",
    type: CartDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request (Validation Error)" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 404,
    description: "Cart or Product not found in cart",
  })
  async updateItemQuantity(
    @Req() req: RequestWithUser,
    @Param("productId", ParseIntPipe) productId: number,
    @Body() updateDto: UpdateCartItemQuantityDto,
  ): Promise<CartDto> {
    if (updateDto.productId && updateDto.productId !== productId) {
      throw new BadRequestException("Product ID in URL and body do not match");
    }
    const userId = req.user.id;
    await this.commandBus.execute(
      new UpdateCartItemQuantityCommand(userId, productId, updateDto.quantity),
    );
    return this.queryBus.execute(new GetCartQuery(userId));
  }
}
