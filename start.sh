#!/bin/bash

echo "🚀 Starting JobSpace Reviews Vault..."
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "📋 Creating backend/.env from example..."
    cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    echo "📋 Creating frontend/.env from example..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "🐳 Starting Docker containers..."
docker compose up --build

echo ""
echo "✅ All services are running!"
echo ""
echo "📍 Access URLs:"
echo "   Frontend:     http://localhost:5173"
echo "   Admin Panel:  http://localhost:5173/admin"
echo "   Public Wall:  http://localhost:5173/reviews/jobspace"
echo "   Backend API:  http://localhost:3000/api"
echo ""
echo "🔑 Admin Credentials:"
echo "   Email:    admin@jobspace.local"
echo "   Password: Admin123!"
echo ""
