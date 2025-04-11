import { Controller, Get, Param, Inject, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '#/domain/repositories/tokens';
import { IProductRepository } from '#/domain/repositories/product.repository.interface';
import { Product } from '#/domain/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  @Get('top-rated')
  async findTopRated(): Promise<Product[]> {
    return this.productRepository.findTopRated(10);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product | null> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
        throw new NotFoundException('Invalid product ID');
    }
    return this.productRepository.findById(productId);
  }
}
