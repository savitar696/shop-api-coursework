import { FindAllProductsOptions } from "#/domain/repositories/product.repository.interface";

export class GetProductsQuery {
  constructor(public readonly options: FindAllProductsOptions) {}
}
