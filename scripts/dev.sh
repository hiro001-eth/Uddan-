#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

echo "\n🚀 Booting Uddaan (DB → Backend → Frontend)"

# 1) Preflight
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js not found. Install Node 18+ and retry."; exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm not found. Install npm and retry."; exit 1
fi

# 2) Ensure backend env exists
if [[ ! -f "$ROOT_DIR/backend/.env" ]]; then
  if [[ -f "$ROOT_DIR/backend/.env.example" ]]; then
    cp "$ROOT_DIR/backend/.env.example" "$ROOT_DIR/backend/.env"
    echo "📝 Created backend/.env from .env.example (edit if needed)"
  else
    cat > "$ROOT_DIR/backend/.env" <<'EOF'
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:3000

JWT_ACCESS_SECRET=change_this_access_secret_at_least_32_chars_long_aaaaaaaa
JWT_REFRESH_SECRET=change_this_refresh_secret_at_least_32_chars_long_bbbbbbbb

COOKIE_SECURE=false
COOKIE_DOMAIN=localhost
COOKIE_SAME_SITE=lax
CSRF_COOKIE_NAME=csrfToken
CSRF_HEADER_NAME=x-csrf-token

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/uddaan?schema=public
PRISMA_LOG_LEVEL=info

SEED_SUPERADMIN_EMAIL=admin@uddaanagencies.com
SEED_SUPERADMIN_PASSWORD=ChangeMe_123!
SEED_SUPERADMIN_NAME=Super Admin
EOF
    echo "📝 Created minimal backend/.env (defaults)."
  fi
fi

# 3) Clean up any previous dev processes and free default ports
echo "🧹 Cleaning up old dev processes (if any)..."
pkill -f 'react-scripts start' 2>/dev/null || true
pkill -f 'tsx watch src/index.ts' 2>/dev/null || true
pkill -f concurrently 2>/dev/null || true
(fuser -k 3000/tcp 2>/dev/null || true)
(fuser -k 5000/tcp 2>/dev/null || true)

# 4) Install deps if needed (idempotent)
echo "📦 Ensuring dependencies are installed..."
(cd "$ROOT_DIR/backend" && npm install >/dev/null 2>&1 || true)
(cd "$ROOT_DIR/frontend" && npm install >/dev/null 2>&1 || true)

# 5) Try to start Postgres (Docker) if available
DB_READY=false
if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  echo "🐳 Starting Postgres via Docker Compose..."
  docker compose -f "$ROOT_DIR/backend/docker-compose.yml" up -d db || true
  # Wait for port to open
  for i in {1..30}; do
    (echo > /dev/tcp/127.0.0.1/5432) >/dev/null 2>&1 && { DB_READY=true; break; } || sleep 1
  done
else
  echo "⚠️  Docker is not running. Checking for local Postgres on 5432..."
  for i in {1..10}; do
    (echo > /dev/tcp/127.0.0.1/5432) >/dev/null 2>&1 && { DB_READY=true; break; } || sleep 1
  done
fi

if [[ "$DB_READY" == true ]]; then
  echo "🗄️  Database is reachable. Running Prisma steps..."
  (cd "$ROOT_DIR/backend" && npx prisma generate >/dev/null 2>&1 || true)
  # Try migrate + seed, but do not fail entire script if they error
  (cd "$ROOT_DIR/backend" && npx prisma migrate dev --name init || true)
  (cd "$ROOT_DIR/backend" && npm run seed || true)
else
  echo "⚠️  Database not reachable on localhost:5432. Skipping migrate/seed."
  echo "   Start Docker (or local Postgres) and re-run if you need DB-backed APIs."
fi

# 6) Resolve ports (auto-bump if busy)
pick_port() {
  local desired=$1
  local port=$desired
  for _ in {1..10}; do
    if (echo > /dev/tcp/127.0.0.1/$port) >/dev/null 2>&1; then
      port=$((port+1))
    else
      echo "$port"
      return 0
    fi
  done
  echo "$desired"
}

FRONTEND_PORT=${FRONTEND_PORT:-3000}
BACKEND_PORT=${BACKEND_PORT:-5000}
FRONTEND_PORT=$(pick_port "$FRONTEND_PORT")
BACKEND_PORT=$(pick_port "$BACKEND_PORT")

echo "🌐 Frontend will run on http://localhost:$FRONTEND_PORT"
echo "🔧 Backend will run on http://localhost:$BACKEND_PORT"

# 7) Start backend and frontend together (avoid hardcoded PORTs in npm scripts)
echo "🚀 Starting dev servers..."
# Choose backend stack: js (Node/Mongoose server.js) or ts (TS/Prisma src/index.ts)
BACK_STACK=${BACK_STACK:-js}
if [[ "$BACK_STACK" == "ts" ]]; then
  BACK_CMD="cd '$ROOT_DIR/backend' && PORT=$BACKEND_PORT CORS_ORIGIN=http://localhost:$FRONTEND_PORT npm run dev"
else
  BACK_CMD="cd '$ROOT_DIR/backend' && PORT=$BACKEND_PORT CORS_ORIGIN=http://localhost:$FRONTEND_PORT npm run dev:js"
fi
FRONT_CMD="cd '$ROOT_DIR/frontend' && PORT=$FRONTEND_PORT npm start"

if command -v npx >/dev/null 2>&1; then
  npx concurrently -n BACKEND,FRONTEND -c blue,green "$BACK_CMD" "$FRONT_CMD"
else
  ./node_modules/.bin/concurrently -n BACKEND,FRONTEND -c blue,green "$BACK_CMD" "$FRONT_CMD"
fi


