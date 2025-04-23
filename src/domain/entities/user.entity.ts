export class User {
  private constructor(
    public readonly id: number | undefined,
    public readonly email: string,
    private password: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(email: string, password: string, name: string): User {
    return new User(undefined, email, password, name, new Date(), new Date());
  }

  static fromPersistence(data: any): User {
    return new User(
      data.id,
      data.email,
      data.password,
      data.name,
      data.createdAt,
      data.updatedAt,
    );
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(password: string): void {
    this.password = password;
  }
}
