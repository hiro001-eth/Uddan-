#!/bin/bash
echo "Starting Udaan Admin System..."
echo "--------------------------------"

# 1. Stop any existing services
echo "Stopping any running services..."
pkill -f "node server.js" 2>/dev/null
pkill -f "react-scripts start" 2>/dev/null

# 2. Start MongoDB
echo "Starting MongoDB..."
sudo systemctl start mongodb
sleep 2

# 3. Start Backend (port 8000)
echo "Starting Backend API on port 8000..."
cd backend
npm start &
sleep 5

# 4. Start Frontend (port 3000)
echo "Starting Frontend on port 3000..."
cd ../frontend
npm start

echo "--------------------------------"
echo "System started successfully!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "Admin Panel: http://localhost:3000/secure-admin-access-2024"