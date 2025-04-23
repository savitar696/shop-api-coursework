import { Injectable } from "@nestjs/common";
import { PrismaService } from "#/infrastructure/prisma/prisma.service";
import { IUserRepository } from "#/domain/repositories/user.repository.interface";
import { User } from "#/domain/entities/user.entity";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        password: user.getPassword(),
        name: user.name,
      },
    });
    return User.fromPersistence(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? User.fromPersistence(user) : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? User.fromPersistence(user) : null;
  }
}
