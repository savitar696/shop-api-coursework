import { SearchProductsOptions } from "#/domain/repositories/product.repository.interface";

export class SearchProductsQuery {
  constructor(
    public readonly query: string,
    public readonly options: SearchProductsOptions,
  ) {}
}
