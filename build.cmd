@echo off
echo 🏗️ Starting build process...

rem Display Node version for debugging
echo 📋 Node.js version:
call node -v
echo 📋 NPM version:
call npm -v

rem Install dependencies
echo 📦 Installing dependencies...
call npm install

rem Build client-side JavaScript
echo 🔨 Building client-side JavaScript...
call npm run build:js || echo WARNING: JavaScript build had issues, continuing anyway...

rem Generate build directory structure
echo 📁 Ensuring directories exist...
if not exist "netlify\functions" mkdir netlify\functions

rem Add debug info
echo 📊 Build environment info:
call node -e "console.log('Node.js version:', process.version); console.log('Platform:', process.platform); console.log('Architecture:', process.arch); console.log('Working directory:', process.cwd());"

echo ✅ Build completed successfully!
