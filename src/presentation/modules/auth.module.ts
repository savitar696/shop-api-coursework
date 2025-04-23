import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "#/presentation/controllers/auth.controller";
import { RegisterHandler } from "#/application/handlers/auth/register.handler";
import { LoginHandler } from "#/application/handlers/auth/login.handler";
import { PrismaUserRepository } from "#/infrastructure/repositories/prisma/user.repository";
import { JwtStrategy } from "#/infrastructure/auth/jwt.strategy";
import { USER_REPOSITORY } from "#/domain/repositories/tokens";

const handlers = [RegisterHandler, LoginHandler];

const providers = [
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
  JwtStrategy,
];

@Module({
  imports: [CqrsModule, JwtModule, PassportModule],
  controllers: [AuthController],
  providers: [...handlers, ...providers],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
