import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "#/presentation/guards/jwt-auth.guard";
import { RequestWithUser } from "#/presentation/interfaces/request-with-user.interface";

import { WishlistDto } from "#/application/wishlist/dtos/wishlist.dto";
import { AddToWishlistDto } from "#/application/wishlist/dtos/add-to-wishlist.dto";
import { GetWishlistQuery } from "#/application/wishlist/queries/get-wishlist.query";
import { AddProductToWishlistCommand } from "#/application/wishlist/commands/add-product-to-wishlist.command";
import { RemoveProductFromWishlistCommand } from "#/application/wishlist/commands/remove-product-from-wishlist.command";

@ApiTags("Wishlist")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("wishlist")
export class WishlistController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: "Получить список избранного текущего пользователя" })
  @ApiResponse({
    status: 200,
    description: "Список избранного",
    type: WishlistDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getWishlist(@Req() req: RequestWithUser): Promise<WishlistDto> {
    const userId = req.user.id;
    return this.queryBus.execute(new GetWishlistQuery(userId));
  }

  @Post("items")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Добавить товар в избранное" })
  @ApiResponse({
    status: 200,
    description: "Обновленный список избранного",
    type: WishlistDto,
  })
  @ApiResponse({ status: 400, description: "Bad Request (Validation Error)" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Product not found" })
  async addProduct(
    @Req() req: RequestWithUser,
    @Body() addToWishlistDto: AddToWishlistDto,
  ): Promise<WishlistDto> {
    const userId = req.user.id;
    const wishlist = await this.commandBus.execute(
      new AddProductToWishlistCommand(userId, addToWishlistDto.productId),
    );
    return WishlistDto.fromEntity(wishlist);
  }

  @Delete("items/:productId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Удалить товар из избранного" })
  @ApiParam({
    name: "productId",
    description: "ID продукта для удаления",
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: "Обновленный список избранного",
    type: WishlistDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Product not found in wishlist" })
  async removeProduct(
    @Req() req: RequestWithUser,
    @Param("productId", ParseIntPipe) productId: number,
  ): Promise<WishlistDto> {
    const userId = req.user.id;
    const wishlist = await this.commandBus.execute(
      new RemoveProductFromWishlistCommand(userId, productId),
    );
    return WishlistDto.fromEntity(wishlist);
  }
}
