#!/bin/bash

echo "🔄 Resetting JobSpace Reviews Vault..."
echo "⚠️  This will delete all data including:"
echo "   - Database (MongoDB)"
echo "   - Uploaded videos and thumbnails"
echo ""
read -p "Are you sure? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Stopping and removing all containers and volumes..."
    docker compose down -v

    echo "🐳 Starting fresh..."
    docker compose up --build

    echo ""
    echo "✅ Reset complete! Fresh installation ready."
    echo ""
    echo "📍 Access URLs:"
    echo "   Frontend:     http://localhost:5173"
    echo "   Admin Panel:  http://localhost:5173/admin"
    echo "   Public Wall:  http://localhost:5173/reviews/jobspace"
    echo ""
    echo "🔑 Admin Credentials:"
    echo "   Email:    admin@jobspace.local"
    echo "   Password: Admin123!"
else
    echo "❌ Reset cancelled."
fi
