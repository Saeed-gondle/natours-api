import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to config.env file
const configPath = path.join(__dirname, 'config.env');

// Read the file if it exists
if (fs.existsSync(configPath)) {
  try {
    const envContent = fs.readFileSync(configPath, 'utf8');

    // Split by new line and filter out comments and empty lines
    const envVars = envContent
      .split('\n')
      .filter(line => line.trim() !== '' && !line.trim().startsWith('#'))
      .map(line => {
        // Extract variable name and value
        const [name, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();

        return { name: name.trim(), value };
      });

    console.log('Environment variables from config.env:');
    console.log(
      'These variables need to be added to Netlify environment settings:'
    );
    console.log('----------------------------------------------------------');

    // Output the variables in a format that makes it easy to copy
    envVars.forEach(({ name, value }) => {
      console.log(`${name}=${value}`);
    });

    console.log('----------------------------------------------------------');
    console.log(
      "Copy these variables to Netlify's environment variables section in the site settings."
    );
  } catch (error) {
    console.error('Error reading config.env file:', error);
  }
} else {
  console.log(
    'config.env file not found. Please create one with your environment variables.'
  );
}
