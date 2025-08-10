#!/bin/bash
echo "Starting Udaan Admin System..."
echo "1. Starting MongoDB..."
sudo systemctl start mongodb
echo "2. Starting Backend (port 8000)..."
cd backend && npm start &
sleep 5
echo "3. Starting Frontend (port 3000)..."
cd ../frontend && npm start