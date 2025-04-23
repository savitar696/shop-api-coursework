# Shop API

Бэкенд для интернет-магазина на NestJS с использованием DDD и CQRS.

## ✨ Стек

*   NestJS
*   TypeScript
*   CQRS
*   Prisma
*   PostgreSQL
*   JWT
*   bcrypt
*   class-validator / class-transformer

## 📋 Требования

*   Node.js (LTS)
*   npm / yarn / pnpm
*   PostgreSQL

## 🚀 Установка

1.  **Клонировать:**
    ```bash
    git clone https://github.com/savitar696/shop-api-coursework.git
    cd shop-api-coursework
    ```

2.  **Зависимости:**
    ```bash
    npm install
    # или
    yarn install
    ```

3.  **Переменные окружения:**
    Создайте файл `.env` в корне (можно скопировать `.env.example`, если есть):
    ```dotenv
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    JWT_SECRET="your-strong-jwt-secret"
    PORT=3000
    ```
    Укажите свои данные для `DATABASE_URL` и придумайте надежный `JWT_SECRET`.

4.  **Миграции БД:**
    Убедитесь, что БД запущена.
    ```bash
    npx prisma migrate dev --name init
    ```
    Команда создаст таблицы на основе `prisma/schema.prisma`.

5.  **Prisma Client:**
    ```bash
    npx prisma generate
    ```
    Генерирует типизированный клиент Prisma.

## ▶️ Запуск

*   **Для разработки:**
    ```bash
    npm run start:dev
    # или
    yarn start:dev
    ```

*   **Для продакшена:**
    ```bash
    # Сначала сборка
    npm run build
    # или
    yarn build

    # Затем запуск
    npm run start:prod
    # или
    yarn start:prod
    ```

Приложение запустится на `http://localhost:3000` (или на порту из `PORT`).

## 🌐 API Маршруты (Endpoints)

Ниже перечислены основные эндпоинты, доступные в API.

### Аутентификация (`/auth`)

*   **`POST /auth/register`**
    *   **Назначение:** Регистрация нового пользователя.
    *   **Тело запроса (Body):**
        ```json
        {
          "email": "user@example.com",
          "password": "yourpassword",
          "name": "Your Name"
        }
        ```
    *   **Ответ (Успех):** `201 Created` - Данные пользователя (без пароля).
    *   **Ответ (Ошибка):** `401 Unauthorized` (если email уже существует).

*   **`POST /auth/login`**
    *   **Назначение:** Вход пользователя.
    *   **Тело запроса (Body):**
        ```json
        {
          "email": "user@example.com",
          "password": "yourpassword"
        }
        ```
    *   **Ответ (Успех):** `200 OK` - `{ "access_token": "your_jwt_token" }`.
    *   **Ответ (Ошибка):** `401 Unauthorized` (неверные учетные данные).

### Продукты (`/products`)

*   **`GET /products`**
    *   **Назначение:** Получить список всех продуктов.
    *   **Ответ:** `200 OK` - Массив объектов продуктов.

*   **`GET /products/top-rated`**
    *   **Назначение:** Получить список продуктов с наивысшим рейтингом (топ-10).
    *   **Ответ:** `200 OK` - Массив объектов продуктов.

*   **`GET /products/:id`**
    *   **Назначение:** Получить продукт по ID.
    *   **Параметр URL:** `:id` (число) - ID продукта (например, `/products/1`).
    *   **Ответ (Успех):** `200 OK` - Объект продукта.
    *   **Ответ (Ошибка):** `404 Not Found` (если продукт не найден или ID некорректен).

### Отзывы (`/reviews`) - Требуют Аутентификации (JWT)

*   **`POST /reviews`**
    *   **Назначение:** Создать отзыв к продукту.
    *   **Заголовки (Headers):** `Authorization: Bearer <your_jwt_token>`
    *   **Тело запроса (Body):**
        ```json
        {
          "productId": 1,          // ID продукта (число)
          "rating": 5,            // Рейтинг (число от 1 до 5)
          "comment": "не понравилось, ставлю дизлайк, пункт выдачи вб фигня!"   // Комментарий (строка)
        }
        ```
    *   **Ответ (Успех):** `201 Created` - Объект созданного отзыва.
    *   **Ответ (Ошибка):** `401 Unauthorized` (если токен невалиден/отсутствует), `404 Not Found` (если продукт или пользователь не найдены), `400 Bad Request` (ошибка валидации).

*   **`GET /reviews/product/:productId`**
    *   **Назначение:** Получить все отзывы для конкретного продукта.
    *   **Заголовки (Headers):** `Authorization: Bearer <your_jwt_token>`
    *   **Параметр URL:** `:productId` (число) - ID продукта (например, `/reviews/product/1`).
    *   **Ответ:** `200 OK` - Массив объектов отзывов для данного продукта (может быть пустым).
    *   **Ответ (Ошибка):** `401 Unauthorized` (если токен невалиден/отсутствует).

## 📂 Структура проекта

Структура организована по слоям (DDD-like):

*   `src/`
    *   `main.ts`: Точка входа.
    *   `app.module.ts`: Корневой модуль.
    *   `domain/`: Бизнес-логика.
        *   `entities/`: Сущности.
        *   `repositories/`: Интерфейсы/токены репозиториев.
        *   `services/`: Доменные сервисы (если нужны).
    *   `application/`: Сценарии использования (Use Cases).
        *   `commands/`: Команды CQRS.
        *   `handlers/`: Обработчики CQRS.
        *   `queries/`: Запросы CQRS (если есть).
        *   `dtos/`: DTO.
    *   `infrastructure/`: Технические детали (адаптеры).
        *   `prisma/`: Prisma.
        *   `repositories/`: Реализации репозиториев.
        *   `auth/`: Логика аутентификации (JWT стратегия и т.д.).
    *   `presentation/`: Слой API (HTTP).
        *   `controllers/`: Контроллеры.
        *   `modules/`: Модули NestJS.
        *   `guards/`: Guards (Auth и т.п.).
        *   `decorators/`: Пользовательские декораторы.

## 👤 Автор

*   **GitHub:** [savitar696](https://github.com/savitar696)
*   **Telegram:** [@slowryz](https://t.me/slowryz)
