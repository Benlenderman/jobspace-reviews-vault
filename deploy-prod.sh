#!/bin/bash

echo "🚀 JobSpace Reviews Vault - Production Deployment"
echo "=================================================="
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found!"
    echo ""
    echo "Please create .env.production from .env.production.example:"
    echo "  cp .env.production.example .env.production"
    echo "  nano .env.production"
    echo ""
    exit 1
fi

# Load environment variables
set -a
source .env.production
set +a

echo "✅ Environment variables loaded"
echo ""

# Generate secrets if not set
if [ "$JWT_SECRET" = "your-super-secret-jwt-key-64-characters-minimum-here" ]; then
    echo "⚠️  Generating JWT_SECRET..."
    JWT_SECRET=$(openssl rand -hex 32)
    export JWT_SECRET
fi

if [ "$REFRESH_TOKEN_SECRET" = "your-another-secret-refresh-token-64-chars-here" ]; then
    echo "⚠️  Generating REFRESH_TOKEN_SECRET..."
    REFRESH_TOKEN_SECRET=$(openssl rand -hex 32)
    export REFRESH_TOKEN_SECRET
fi

echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "🌱 Running database seed..."
docker-compose -f docker-compose.prod.yml exec -T backend npm run seed

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Your application is running at:"
echo "   Frontend: http://localhost (port 80)"
echo "   Backend API: http://localhost:3000/api"
echo ""
echo "👤 Admin Login:"
echo "   Email: benlenderman2@gmail.com"
echo "   Password: 2wsx@WSX"
echo ""
echo "📝 View logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose -f docker-compose.prod.yml down"
echo ""
