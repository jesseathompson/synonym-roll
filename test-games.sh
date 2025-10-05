#!/bin/bash

# Script to test all games in playable_games.json for playability
# Uses the actual WordGraph class from the frontend

echo "🧪 Testing all games in playable_games.json for playability..."
echo "📊 Using WordGraph class from frontend code"
echo ""

cd app

# Install tsx if not already installed
if ! npm list tsx > /dev/null 2>&1; then
    echo "📦 Installing tsx dependency..."
    npm install tsx --save-dev
fi

# Run the test
echo "🚀 Running game validation test..."
npm run test-playable-games

echo ""
echo "✅ Test completed!"
