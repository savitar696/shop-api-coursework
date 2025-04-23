import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { PRODUCT_REPOSITORY } from "#/domain/repositories/tokens";
import { IProductRepository } from "#/domain/repositories/product.repository.interface";
import { SearchProductsQuery } from "../queries/search-products.query";
import { PaginatedProductDto } from "../dtos/paginated-product.dto";
import { ProductDto } from "#/presentation/controllers/product.controller";

@QueryHandler(SearchProductsQuery)
export class SearchProductsHandler
  implements IQueryHandler<SearchProductsQuery>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: SearchProductsQuery): Promise<PaginatedProductDto> {
    const { query: searchQuery, options } = query;
    const { skip = 0, take = 10 } = options;

    const paginatedResult = await this.productRepository.search(
      searchQuery,
      options,
    );

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
