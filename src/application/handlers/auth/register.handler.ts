import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterCommand } from '#/application/commands/auth/register.command';
import { USER_REPOSITORY } from '#/domain/repositories/tokens';
import { User } from '#/domain/entities/user.entity';
import { IUserRepository } from '#/domain/repositories/user.repository.interface';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: RegisterCommand): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);
    const user = User.create(command.email, hashedPassword, command.name);
    return this.userRepository.create(user);
  }
}
