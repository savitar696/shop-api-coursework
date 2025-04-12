import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '#/infrastructure/prisma/prisma.module';
import { AuthModule } from '#/presentation/modules/auth.module';
import { ProductModule } from '#/presentation/modules/product.module';
import { ReviewModule } from '#/presentation/modules/review.module';
import { CartModule } from '#/presentation/modules/cart.module';
import { OrderModule } from '#/presentation/modules/order.module';

const modules = [
  AuthModule,
  ProductModule,
  ReviewModule,
  CartModule,
  OrderModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-key',
        signOptions: { expiresIn: '30d' },
      }),
    }),
    PassportModule,
    PrismaModule,
    ...modules,
  ],
  exports: [
    JwtModule,
  ],
})
export class AppModule {}
