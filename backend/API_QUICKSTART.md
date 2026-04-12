# API Quickstart (реально работает)

Короткая инструкция для фронтенда.

## 1) Запуск
1. `npm install`
2. `npm run prisma:migrate:deploy`
3. `npm run prisma:generate`
4. `npm run seed`
5. `npm run dev`

Base URL: `http://localhost:3000/api`

## 2) Авторизация
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

После login/register брать `tokens.accessToken` и отправлять:
`Authorization: Bearer <accessToken>`

## 3) Публичные запросы
- `GET /health`
- `GET /pages/:slug`
- `GET /exhibits`
- `GET /excursions`
- `GET /excursions/:id/slots`

## 4) Личный кабинет (нужен Bearer token)
- `GET /me`
- `GET /me/orders`
- `GET /me/bookings`

## 5) Покупка экскурсии
1. Создать заказ: `POST /orders`
2. Добавить билет: `POST /orders/:orderId/items`
3. Создать платеж: `POST /orders/:orderId/payments`
4. После оплаты дернуть webhook: `POST /payments/webhook`

## 6) Минимальные body-примеры
Регистрация:
```json
{
  "email": "user@mail.com",
  "password": "strongpass123",
  "displayName": "Ivan"
}
```

Добавление билета:
```json
{
  "excursionId": "uuid",
  "slotId": "uuid",
  "quantity": 1
}
```

Webhook успеха оплаты:
```json
{
  "provider": "YOOKASSA",
  "providerEventId": "event-001",
  "eventType": "payment.succeeded",
  "providerPaymentId": "sandbox-...",
  "status": "SUCCEEDED"
}
```
