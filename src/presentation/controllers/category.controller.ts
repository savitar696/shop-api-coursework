import {
  Controller,
  Get,
  Param,
  NotFoundException,
  ParseIntPipe,
} from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CategoryDto } from "#/application/categories/dtos/category.dto";
import { GetAllCategoriesQuery } from "#/application/categories/queries/get-all-categories.query";

@ApiTags("Categories")
@Controller("categories")
export class CategoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: "Получить список всех категорий" })
  @ApiResponse({
    status: 200,
    description: "Список категорий",
    type: [CategoryDto],
  })
  async findAll(): Promise<CategoryDto[]> {
    return this.queryBus.execute(new GetAllCategoriesQuery());
  }

  /*
  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', description: 'ID категории', type: Number })
  @ApiResponse({ status: 200, description: 'Данные категории', type: CategoryDto })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<CategoryDto> {
    const category = await this.queryBus.execute(new GetCategoryByIdQuery(id));
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
  */
}
