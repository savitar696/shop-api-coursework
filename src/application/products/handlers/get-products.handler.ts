import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "#/domain/repositories/tokens";
import { IProductRepository } from "#/domain/repositories/product.repository.interface";
import { GetProductsQuery } from "../queries/get-products.query";
import { PaginatedProductDto } from "../dtos/paginated-product.dto";
import { ProductDto } from "#/presentation/controllers/product.controller";

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<PaginatedProductDto> {
    const { options } = query;
    const { skip = 0, take = 10 } = options;

    const paginatedResult = await this.productRepository.findAll(options);

    const totalPages = Math.ceil(paginatedResult.total / take);
    const page = Math.floor(skip / take) + 1;

    return {
      data: paginatedResult.data.map(ProductDto.fromEntity),
      total: paginatedResult.total,
      limit: take,
      page: page,
      totalPages: totalPages,
    };
  }
}
