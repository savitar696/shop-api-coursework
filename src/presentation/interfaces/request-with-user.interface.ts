import { Request } from 'express';
import { User } from '#/domain/entities/user.entity'; // Импортируем доменную сущность User

// Расширяем стандартный интерфейс Request из Express
// Указываем, что поле user будет содержать сущность User
export interface RequestWithUser extends Request {
  user: User;
}
