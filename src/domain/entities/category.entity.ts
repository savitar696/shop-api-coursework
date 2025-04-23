export class Category {
  id: number;
  name: string;
  slug: string;
  description?: string;

  constructor(id: number, name: string, slug: string, description?: string) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
  }

  static fromPersistence(data: any): Category {
    return new Category(data.id, data.name, data.slug, data.description);
  }
}
