import {
  Controller,
  Get,
  Post,
  Delete,
  Patch, // или Put
  Body,
  Param, // Если используем productId в URL для удаления/обновления
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'; // Для документации API
import { JwtAuthGuard } from '#/presentation/guards/jwt-auth.guard'; // Путь к вашему JWT Guard
import { RequestWithUser } from '#/presentation/interfaces/request-with-user.interface'; // Интерфейс для добавления user к Request

// DTOs
import { AddItemToCartDto } from '#/application/cart/dtos/add-item-to-cart.dto';
import { RemoveItemFromCartDto } from '#/application/cart/dtos/remove-item-from-cart.dto'; // Используем, если productId в body
import { UpdateCartItemQuantityDto } from '#/application/cart/dtos/update-cart-item-quantity.dto';
import { CartDto } from '#/application/cart/dtos/cart.dto';

// Commands & Queries
import { AddItemToCartCommand } from '#/application/cart/commands/add-item-to-cart.command';
import { GetCartQuery } from '#/application/cart/queries/get-cart.query';
import { RemoveItemFromCartCommand } from '#/application/cart/commands/remove-item-from-cart.command';
import { UpdateCartItemQuantityCommand } from '#/application/cart/commands/update-cart-item-quantity.command';

@ApiTags('Cart') // Группа эндпоинтов в Swagger
@ApiBearerAuth() // Указывает, что эндпоинты требуют JWT
@UseGuards(JwtAuthGuard) // Защищаем все эндпоинты контроллера
@Controller('cart')
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить корзину текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Корзина пользователя', type: CartDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCart(@Req() req: RequestWithUser): Promise<CartDto> {
    const userId = req.user.id; // Используем req.user.id вместо req.user.sub
    return this.queryBus.execute(new GetCartQuery(userId));
  }

  @Post('items')
  @HttpCode(HttpStatus.OK) // Возвращаем 200 OK вместо 201 Created, т.к. это модификация ресурса (корзины)
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({ status: 200, description: 'Обновленная корзина', type: CartDto })
  @ApiResponse({ status: 400, description: 'Bad Request (Validation Error)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @ApiResponse({ status: 404, description: 'Product not found' }) // Если AddItemToCartHandler может бросать 404
  async addItem(
    @Req() req: RequestWithUser,
    @Body() addItemDto: AddItemToCartDto,
  ): Promise<CartDto> {
    const userId = req.user.id; // Используем req.user.id вместо req.user.sub
    await this.commandBus.execute(
      new AddItemToCartCommand(userId, addItemDto.productId, addItemDto.quantity),
    );
    // Возвращаем обновленную корзину
    return this.queryBus.execute(new GetCartQuery(userId));
  }

  @Delete('items/:productId') // Удаление по productId в URL
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiResponse({ status: 200, description: 'Обновленная корзина', type: CartDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart or Product not found in cart' })
  async removeItem(
    @Req() req: RequestWithUser,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<CartDto> {
    const userId = req.user.id; // Используем req.user.id вместо req.user.sub
    await this.commandBus.execute(
      new RemoveItemFromCartCommand(userId, productId),
    );
    return this.queryBus.execute(new GetCartQuery(userId));
  }

  // Альтернативное удаление (если productId передается в теле)
  /*
  @Delete('items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить товар из корзины (productId в теле)' })
  // ... ApiResponse ...
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

  @Patch('items/:productId') // Обновление по productId в URL
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Изменить количество товара в корзине' })
  @ApiResponse({ status: 200, description: 'Обновленная корзина', type: CartDto })
  @ApiResponse({ status: 400, description: 'Bad Request (Validation Error)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Cart or Product not found in cart' })
  async updateItemQuantity(
    @Req() req: RequestWithUser,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateDto: UpdateCartItemQuantityDto, // Используем DTO для получения quantity
  ): Promise<CartDto> {
    // Можно добавить проверку, что productId в URL совпадает с productId в DTO, если он там есть
    if (updateDto.productId && updateDto.productId !== productId) {
        throw new BadRequestException('Product ID in URL and body do not match');
    }
    const userId = req.user.id; // Используем req.user.id вместо req.user.sub
    await this.commandBus.execute(
      new UpdateCartItemQuantityCommand(userId, productId, updateDto.quantity),
    );
    return this.queryBus.execute(new GetCartQuery(userId));
  }
}
