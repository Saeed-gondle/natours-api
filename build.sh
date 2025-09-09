#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🏗️ Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build client-side JavaScript
echo "🔨 Building client-side JavaScript..."
npm run build:js

# Generate build directory structure
echo "📁 Ensuring directories exist..."
mkdir -p netlify/functions

echo "✅ Build completed successfully!"
