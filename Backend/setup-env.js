const fs = require('fs');
const path = require('path');

const envContent = `# Google Sheets Configuration
SPREADSHEET_ID=1W82kmjNEDbnUPtyc1rjz24CjUn5V1RKZmlF6Ym9B2_A

# Server Configuration
PORT=5000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📊 Google Sheet ID configured:', '1W82kmjNEDbnUPtyc1rjz24CjUn5V1RKZmlF6Ym9B2_A');
  console.log('🚀 You can now start the server with: node server.js');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n💡 Please create a .env file manually with the following content:');
  console.log(envContent);
}
