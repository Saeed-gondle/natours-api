console.log('Checking for parcel-bundler installation...');

try {
  const parcelPath = require.resolve('parcel-bundler');
  console.log('✅ parcel-bundler found at:', parcelPath);
} catch (error) {
  console.error('❌ parcel-bundler not found in node_modules!');
  console.error(error);
  process.exit(1);
}

console.log('Checking NODE_ENV:', process.env.NODE_ENV);
console.log('Checking current directory:', process.cwd());
console.log('Checking for public/js directory...');

const fs = require('fs');
const path = require('path');

const publicJsPath = path.join(process.cwd(), 'public', 'js');
const indexJsPath = path.join(publicJsPath, 'index.js');

try {
  if (fs.existsSync(publicJsPath)) {
    console.log('✅ public/js directory exists');
    
    if (fs.existsSync(indexJsPath)) {
      console.log('✅ public/js/index.js exists');
    } else {
      console.log('❌ public/js/index.js does not exist!');
    }
  } else {
    console.log('❌ public/js directory does not exist!');
  }
} catch (error) {
  console.error('❌ Error checking directories:', error);
}
