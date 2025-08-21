
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

echo "🚀 Setting up Uddaan Consultancy Project"

# Install root dependencies
echo "📦 Installing root dependencies..."
cd "$ROOT_DIR" && npm install

# Setup backend
echo "🔧 Setting up backend..."
cd "$ROOT_DIR/backend"
npm install

# Generate Prisma client and setup database
echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push --force-reset
npm run seed

# Setup frontend  
echo "🎨 Setting up frontend..."
cd "$ROOT_DIR/frontend"
npm install
npx update-browserslist-db@latest

echo "✅ Setup complete! Run 'npm run dev' to start the application."
