import { Controller, Get, Param, Inject, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '#/domain/repositories/tokens';
import { IProductRepository } from '#/domain/repositories/product.repository.interface';
import { Product } from '#/domain/entities/product.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiProperty } from '@nestjs/swagger';

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

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех продуктов' })
  @ApiResponse({ status: 200, description: 'Список продуктов', type: [ProductDto] })
  async findAll(): Promise<ProductDto[]> {
    const products = await this.productRepository.findAll();
    return products.map(ProductDto.fromEntity);
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Получить топ-10 продуктов по рейтингу' })
  @ApiResponse({ status: 200, description: 'Топ-10 продуктов', type: [ProductDto] })
  async findTopRated(): Promise<ProductDto[]> {
    const products = await this.productRepository.findTopRated(10);
    return products.map(ProductDto.fromEntity);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiParam({ name: 'id', description: 'ID продукта', type: Number })
  @ApiResponse({ status: 200, description: 'Данные продукта', type: ProductDto })
  @ApiResponse({ status: 404, description: 'Продукт не найден или неверный ID' })
  async findById(@Param('id', ParseIntPipe) productId: number): Promise<ProductDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return ProductDto.fromEntity(product);
  }
}
