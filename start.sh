#!/bin/bash

echo "🚀 Starting Uddaan Consultancy..."
echo "=================================="

# Check if MongoDB is running
if ! systemctl is-active --quiet mongodb; then
    echo "📦 Starting MongoDB..."
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    cd backend && npm install && cd ..
    cd frontend && npm install && cd ..
fi

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating environment file..."
    cat > backend/.env << EOF
MONGODB_URI=mongodb://localhost:27017/uddaan-consultancy
PORT=5000
NODE_ENV=development
EOF
fi

# Start the application
echo "🎯 Starting application..."
npm run dev

echo ""
echo "✅ Application is starting up!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "👤 Admin: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop" 