const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

// Google Sheets configuration
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'disaster-management312-be80c55826f0.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function testSheetAccess() {
  try {
    console.log('Testing access to Google Sheet...');
    console.log('Spreadsheet ID:', process.env.SPREADSHEET_ID);
    
    // Test reading the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A1:D5',
    });

    console.log('✅ Successfully accessed the sheet!');
    console.log('Current data:');
    console.table(response.data.values);

    // Test writing to the sheet
    const testData = [
      ['Test Location', '1234567890', 'safe', 'test disaster']
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A:D',
      valueInputOption: 'RAW',
      resource: { values: testData }
    });

    console.log('✅ Successfully wrote test data to the sheet!');
    console.log('Test data added:', testData[0]);

  } catch (error) {
    console.error('❌ Error accessing Google Sheet:', error.message);
    
    if (error.message.includes('permission')) {
      console.log('\n🔧 To fix this:');
      console.log('1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1W82kmjNEDbnUPtyc1rjz24CjUn5V1RKZmlF6Ym9B2_A');
      console.log('2. Click "Share" button (top right)');
      console.log('3. Add this email: disaster-app-service@disaster-management312.iam.gserviceaccount.com');
      console.log('4. Give "Editor" permissions');
      console.log('5. Run this test again');
    }
  }
}

testSheetAccess();

