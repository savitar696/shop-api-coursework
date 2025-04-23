import { ApiProperty } from "@nestjs/swagger";
import { Category } from "#/domain/entities/category.entity";

export class CategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string;

  static fromEntity(entity: Category): CategoryDto {
    const dto = new CategoryDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.slug = entity.slug;
    dto.description = entity.description;
    return dto;
  }
}
