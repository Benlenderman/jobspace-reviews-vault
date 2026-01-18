#!/bin/bash

echo "🔍 JobSpace Reviews Vault - Pre-flight Check"
echo "=============================================="
echo ""

# Check Docker
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker installed: $(docker --version)"

    # Check if Docker daemon is running
    if docker ps &> /dev/null; then
        echo "✅ Docker daemon is running"
    else
        echo "⚠️  Docker is installed but daemon is not running"
        echo "   → Open Docker Desktop and wait for it to start"
    fi
else
    echo "❌ Docker not found"
    echo "   → Install from: https://www.docker.com/products/docker-desktop/"
    echo "   → See INSTALL_DOCKER.md for instructions"
fi

echo ""

# Check Docker Compose
echo "Checking Docker Compose..."
if command -v docker compose &> /dev/null || command -v docker-compose &> /dev/null; then
    if command -v docker compose &> /dev/null; then
        echo "✅ Docker Compose available (docker compose)"
    else
        echo "✅ Docker Compose available (docker-compose)"
    fi
else
    echo "❌ Docker Compose not found"
fi

echo ""

# Check ports
echo "Checking required ports..."
PORT_3000=$(lsof -ti:3000 2>/dev/null)
PORT_5173=$(lsof -ti:5173 2>/dev/null)
PORT_27017=$(lsof -ti:27017 2>/dev/null)

if [ -z "$PORT_3000" ]; then
    echo "✅ Port 3000 available (Backend)"
else
    echo "⚠️  Port 3000 in use by PID: $PORT_3000"
    echo "   → Kill with: kill $PORT_3000"
fi

if [ -z "$PORT_5173" ]; then
    echo "✅ Port 5173 available (Frontend)"
else
    echo "⚠️  Port 5173 in use by PID: $PORT_5173"
    echo "   → Kill with: kill $PORT_5173"
fi

if [ -z "$PORT_27017" ]; then
    echo "✅ Port 27017 available (MongoDB)"
else
    echo "⚠️  Port 27017 in use by PID: $PORT_27017"
    echo "   → Kill with: kill $PORT_27017"
fi

echo ""

# Check env files
echo "Checking environment files..."
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env exists"
else
    echo "⚠️  backend/.env not found"
    echo "   → Will be created automatically by start.sh"
fi

if [ -f "frontend/.env" ]; then
    echo "✅ frontend/.env exists"
else
    echo "⚠️  frontend/.env not found"
    echo "   → Will be created automatically by start.sh"
fi

echo ""
echo "=============================================="

# Summary
if command -v docker &> /dev/null && docker ps &> /dev/null; then
    echo "✅ Ready to run! Execute: ./start.sh"
else
    echo "❌ Not ready. Please install Docker first."
    echo "   See: INSTALL_DOCKER.md"
fi
