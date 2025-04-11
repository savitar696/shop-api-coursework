import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginCommand } from '#/application/commands/auth/login.command';
import { USER_REPOSITORY } from '#/domain/repositories/tokens';
import { IUserRepository } from '#/domain/repositories/user.repository.interface';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand): Promise<{ access_token: string }> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user || !(await bcrypt.compare(command.password, user.getPassword()))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }), /// в app.module.ts я дал подсказку, что тут не работает ключ из env...
    };
  }
}
