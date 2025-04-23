import {
  Controller,
  Get,
  Param,
  Inject,
  NotFoundException,
  ParseIntPipe,
  Query,
  BadRequestException,
  DefaultValuePipe,
} from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "#/domain/repositories/tokens";
import { IProductRepository } from "#/domain/repositories/product.repository.interface";
import { Product } from "#/domain/entities/product.entity";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProperty,
  ApiQuery,
} from "@nestjs/swagger";
import { PaginatedProductDto } from "#/application/products/dtos/paginated-product.dto";
import { SearchProductsQuery } from "#/application/products/queries/search-products.query";
import { QueryBus } from "@nestjs/cqrs";

export class ProductDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty({ required: false, nullable: true })
  image?: string;
  @ApiProperty()
  rating: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: Product): ProductDto {
    const dto = new ProductDto();
    Object.assign(dto, entity);
    return dto;
  }
}

@ApiTags("Products")
@Controller("products")
export class ProductController {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly queryBus: QueryBus,
  ) {}

  @Get("search")
  @ApiOperation({ summary: "Поиск продуктов по названию или описанию" })
  @ApiQuery({
    name: "q",
    required: true,
    type: String,
    description: "Поисковый запрос",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Номер страницы (начиная с 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Количество элементов на странице",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "Пагинированный список найденных продуктов",
    type: PaginatedProductDto,
  })
  @ApiResponse({
    status: 400,
    description: "Неверные параметры запроса (например, пустой q)",
  })
  async searchProducts(
    @Query("q") query: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedProductDto> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException("Query parameter 'q' cannot be empty");
    }
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;
    const options = { skip, take: limit };

    return this.queryBus.execute(new SearchProductsQuery(query, options));
  }

  @Get()
  @ApiOperation({
    summary:
      "Получить список продуктов с фильтрацией, сортировкой и пагинацией",
  })
  @ApiQuery({ name: "categoryId", required: false, type: Number })
  @ApiQuery({ name: "minPrice", required: false, type: Number })
  @ApiQuery({ name: "maxPrice", required: false, type: Number })
  @ApiQuery({
    name: "sortBy",
    required: false,
    enum: ["price", "name", "rating", "createdAt"],
  })
  @ApiQuery({ name: "sortOrder", required: false, enum: ["asc", "desc"] })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Номер страницы (начиная с 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Количество элементов на странице",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "Пагинированный список продуктов",
    type: PaginatedProductDto,
  })
  @ApiResponse({ status: 400, description: "Неверные параметры запроса" })
  async findAll(
    @Query("categoryId", new ParseIntPipe({ optional: true }))
    categoryId?: number,
    @Query("minPrice", new ParseIntPipe({ optional: true })) minPrice?: number,
    @Query("maxPrice", new ParseIntPipe({ optional: true })) maxPrice?: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query("sortBy") sortBy?: "price" | "name" | "rating" | "createdAt",
    @Query("sortOrder") sortOrder?: "asc" | "desc",
  ): Promise<PaginatedProductDto> {
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;

    const options = {
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      skip,
      take: limit,
    };

    const paginatedResult = await this.productRepository.findAll(options);
    const totalPages = Math.ceil(paginatedResult.total / limit);

    return {
      data: paginatedResult.data.map(ProductDto.fromEntity),
      total: paginatedResult.total,
      limit: limit,
      page: page,
      totalPages: totalPages,
    };
  }

  @Get("top-rated")
  @ApiOperation({ summary: "Получить топ-10 продуктов по рейтингу" })
  @ApiResponse({
    status: 200,
    description: "Топ-10 продуктов",
    type: [ProductDto],
  })
  async findTopRated(): Promise<ProductDto[]> {
    const products = await this.productRepository.findTopRated(10);
    return products.map(ProductDto.fromEntity);
  }

  @Get("newest")
  @ApiOperation({ summary: "Получить топ-10 новых продуктов" })
  @ApiResponse({
    status: 200,
    description: "Топ-10 новых продуктов",
    type: [ProductDto],
  })
  async findNewest(): Promise<ProductDto[]> {
    const products = await this.productRepository.findNewest(10);
    return products.map(ProductDto.fromEntity);
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить продукт по ID" })
  @ApiParam({ name: "id", description: "ID продукта", type: Number })
  @ApiResponse({
    status: 200,
    description: "Данные продукта",
    type: ProductDto,
  })
  @ApiResponse({
    status: 404,
    description: "Продукт не найден или неверный ID",
  })
  async findById(
    @Param("id", ParseIntPipe) productId: number,
  ): Promise<ProductDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return ProductDto.fromEntity(product);
  }
}
