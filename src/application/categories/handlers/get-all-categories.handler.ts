import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { CATEGORY_REPOSITORY } from "#/domain/repositories/category.repository.interface";
import { ICategoryRepository } from "#/domain/repositories/category.repository.interface";
import { GetAllCategoriesQuery } from "../queries/get-all-categories.query";
import { CategoryDto } from "../dtos/category.dto";

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler
  implements IQueryHandler<GetAllCategoriesQuery>
{
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(query: GetAllCategoriesQuery): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map(CategoryDto.fromEntity);
  }
}
