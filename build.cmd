@echo off
echo 🏗️ Starting build process...

rem Install dependencies
echo 📦 Installing dependencies...
call npm install

rem Build client-side JavaScript
echo 🔨 Building client-side JavaScript...
call npm run build:js

rem Generate build directory structure
echo 📁 Ensuring directories exist...
if not exist "netlify\functions" mkdir netlify\functions

echo ✅ Build completed successfully!
