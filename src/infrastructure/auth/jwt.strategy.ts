import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { USER_REPOSITORY } from '#/domain/repositories/tokens';
import { IUserRepository } from '#/domain/repositories/user.repository.interface';
import { User } from '#/domain/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret-key',
    });
  }

  async validate(payload: { sub: string }): Promise<User | null> {
    const userId = parseInt(payload.sub, 10);
    if (isNaN(userId)) {
      return null;
    }
    const user = await this.userRepository.findById(userId);
    return user;
  }
}
