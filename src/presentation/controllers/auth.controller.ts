import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { RegisterCommand } from "#/application/commands/auth/register.command";
import { LoginCommand } from "#/application/commands/auth/login.command";
import { IsEmail, IsString, MinLength } from "class-validator";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
} from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email пользователя",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "Пароль (минимум 6 символов)",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "John Doe", description: "Имя пользователя" })
  @IsString()
  name: string;
}

export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email пользователя",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123", description: "Пароль" })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: "JWT токен доступа" })
  access_token: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("register")
  @ApiOperation({ summary: "Регистрация нового пользователя" })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно создан",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Ошибка валидации или Email уже существует",
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.commandBus.execute(
      new RegisterCommand(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      ),
    );
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Вход пользователя и получение JWT" })
  @ApiResponse({
    status: 200,
    description: "Успешный вход",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: "Неверные учетные данные" })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.commandBus.execute(
      new LoginCommand(loginDto.email, loginDto.password),
    );
  }
}
