import { ApiProperty } from "@nestjs/swagger";
import { ProductDto } from "#/presentation/controllers/product.controller";

export class PaginatedProductDto {
  @ApiProperty({
    type: [ProductDto],
    description: "Массив продуктов на текущей странице",
  })
  data: ProductDto[];

  @ApiProperty({
    description: "Общее количество продуктов, удовлетворяющих фильтрам",
  })
  total: number;

  @ApiProperty({ description: "Количество элементов на странице (limit)" })
  limit: number;

  @ApiProperty({ description: "Номер текущей страницы (начиная с 1)" })
  page: number;

  @ApiProperty({ description: "Общее количество страниц" })
  totalPages: number;
}
