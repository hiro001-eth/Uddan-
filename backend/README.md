# Uddaan Agencies Backend

Production-ready Node.js + Express + TypeScript + Prisma (PostgreSQL) backend with JWT (httpOnly cookies), TOTP 2FA, RBAC, Zod validation, Swagger docs, Jest tests, Docker, and Render deployment.

## Quickstart

1. Copy env and start services

```bash
cd backend
cp .env.example .env
docker-compose up -d
```

2. Install deps and generate client

```bash
npm install
npx prisma generate
```

3. Migrate and seed

```bash
npx prisma migrate dev --name init
npm run seed
```

4. Run dev server

```bash
npm run dev
# Open http://localhost:3000/health and http://localhost:3000/docs
```

Seed super-admin:
- Email: admin@uddaanagencies.com
- Password: ChangeMe_123!
- MFA: On first login, use the `otpauth://` URL printed by the seed to add to an authenticator app.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – compile TypeScript
- `npm test` – run tests
- `npm run seed` – seed database

## API Docs
Swagger UI at `/docs`. OpenAPI source at `openapi/openapi.yaml`.

## Deployment (Render)
- Create a PostgreSQL instance
- Create a Web Service from this repo path `backend/`
- Environment: `Docker`
- Add env vars from `.env.example` (set `NODE_ENV=production`, `COOKIE_SECURE=true`, `CORS_ORIGIN=https://admin.uddaanagencies.com`)
- Health check path: `/health`
- Start command: `sh -c "npx prisma migrate deploy && node dist/index.js"`

## Testing
- `docker-compose up -d`
- `npx prisma migrate dev`
- `npm test`

## Curl examples

Login:
```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@uddaanagencies.com","password":"ChangeMe_123!"}'
```

Verify 2FA (replace CODE and cookie jar handling as needed):
```bash
curl -i -X POST http://localhost:3000/api/auth/verify-2fa \
  -H 'Content-Type: application/json' \
  -H 'x-csrf-token: $(node -e "console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))")' \
  --cookie 'refreshToken=...; csrfToken=...' \
  -d '{"code":"123456"}'
```

List jobs:
```bash
curl -i http://localhost:3000/api/jobs --cookie 'accessToken=...; csrfToken=...'
```
