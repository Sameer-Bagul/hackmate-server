#!/bin/bash
# HackMate Quick Start Script
# This script helps you get started with HackMate after the monorepo migration

set -e

echo "🚀 HackMate Quick Start"
echo "======================="
echo ""

# Check if we're in the right directory
if [ ! -d "server" ] || [ ! -d "cli" ]; then
    echo "❌ Error: Please run this script from the hackmate root directory"
    exit 1
fi

echo "📦 Step 1: Installing Server Dependencies"
echo "=========================================="
cd server
npm install
echo "✅ Server dependencies installed"
echo ""

echo "📦 Step 2: Installing CLI Dependencies"
echo "======================================"
cd ../cli
npm install
echo "✅ CLI dependencies installed"
echo ""

echo "⚙️  Step 3: Setting up environment files"
echo "========================================"
cd ../server
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created server/.env from .env.example"
    echo "⚠️  IMPORTANT: Edit server/.env with your MongoDB, Redis, and SMTP credentials"
else
    echo "ℹ️  server/.env already exists"
fi

cd ../cli
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created cli/.env from .env.example"
else
    echo "ℹ️  cli/.env already exists"
fi
echo ""

echo "🔨 Step 4: Building projects"
echo "==========================="
cd ../server
npm run build
echo "✅ Server built successfully"

cd ../cli
npm run build
echo "✅ CLI built successfully"
echo ""

echo "🔗 Step 5: Linking CLI globally (optional)"
echo "=========================================="
cd ../cli
npm link
echo "✅ CLI linked globally - you can now use 'hackmate' command anywhere!"
echo ""

echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit server/.env with your database credentials"
echo ""
echo "2. Start the server:"
echo "   cd server && npm run dev"
echo ""
echo "3. In another terminal, use the CLI:"
echo "   hackmate auth signup"
echo "   hackmate chat"
echo "   hackmate discover"
echo ""
echo "For more information, see:"
echo "  - README.md (main guide)"
echo "  - server/README.md (API documentation)"
echo "  - cli/README.md (CLI usage)"
echo "  - MIGRATION_COMPLETE.md (migration details)"
echo ""
echo "Happy hacking! 🎉"
