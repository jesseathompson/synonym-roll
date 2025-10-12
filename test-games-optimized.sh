#!/bin/bash

# Optimized test script for playable games
# Usage: ./test-games-optimized.sh [--parallel|--optimized]

echo "🚀 Running optimized playable games test..."

# Check if node_modules exists, if not, run npm install
if [ ! -d "./app/node_modules" ]; then
  echo "node_modules not found. Running npm install in app directory..."
  (cd app && npm install)
  if [ $? -ne 0 ]; then
    echo "Error: npm install failed."
    exit 1
  fi
fi

# Run the optimized test script
# Pass along any arguments to the script
npx tsx test-playable-games-optimized.ts "$@"

if [ $? -eq 0 ]; then
  echo "✅ Optimized playable games test completed successfully."
else
  echo "❌ Optimized playable games test failed."
  exit 1
fi
