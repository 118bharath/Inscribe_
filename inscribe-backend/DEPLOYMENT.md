# Deployment Guide

## 1. Configure environment
Copy `.env.example` to `.env` and set secure values.

Required values:
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET` (64+ chars random)
- `ALLOWED_ORIGINS` (production frontend URLs)
- `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

## 2. Build and test
```bash
./mvnw test
./mvnw -DskipTests package
```

## 3. Run with Docker Compose
```bash
docker compose --env-file .env up --build -d
```

## 4. Health check
- `GET /actuator/health`

## 5. API docs
- `GET /swagger-ui/index.html`

## WebSocket auth contract
Client STOMP `CONNECT` must send `Authorization: Bearer <access-token>` and subscribe to:
- `/user/queue/notifications`

## Token refresh contract
`POST /api/auth/refresh` now requires:
- `refreshToken`
- `deviceId`

Use a stable `deviceId` per client installation/session.
