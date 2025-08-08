#!/bin/bash

echo "🚀 Starting Uddaan Consultancy Project..."
echo "=========================================="

# Check if MongoDB is running
if ! systemctl is-active --quiet mongodb; then
    echo "📦 Starting MongoDB..."
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
fi

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend Server (FastAPI)..."
    cd backend
    python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "✅ Backend running on http://localhost:8000"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server (React)..."
    cd frontend
    export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
    yarn start &
    FRONTEND_PID=$!
    echo "✅ Frontend running on http://localhost:3000"
    cd ..
}

# Start both servers
start_backend
sleep 3
start_frontend

echo ""
echo "🎉 Both servers are starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait 