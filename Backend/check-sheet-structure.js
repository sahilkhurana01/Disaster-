const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

// Google Sheets configuration
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'disaster-management312-be80c55826f0.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function checkSheetStructure() {
  try {
    console.log('Checking Google Sheet structure...');
    console.log('Spreadsheet ID:', process.env.SPREADSHEET_ID);
    
    // Get sheet metadata to see all subsheets
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
    });

    console.log('\n📊 Available sheets:');
    spreadsheet.data.sheets.forEach((sheet, index) => {
      console.log(`${index + 1}. Sheet Name: "${sheet.properties.title}"`);
      console.log(`   Sheet ID: ${sheet.properties.sheetId}`);
      console.log(`   Grid Properties: ${JSON.stringify(sheet.properties.gridProperties)}`);
      console.log('');
    });

    // Check if "Users Info" sheet exists
    const usersInfoSheet = spreadsheet.data.sheets.find(sheet => 
      sheet.properties.title.toLowerCase().includes('users info') || 
      sheet.properties.title.toLowerCase().includes('usersinfo')
    );

    if (usersInfoSheet) {
      console.log('✅ Found "Users Info" sheet!');
      console.log('Sheet ID:', usersInfoSheet.properties.sheetId);
      
      // Read the data from Users Info sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: `${usersInfoSheet.properties.title}!A1:Z10`,
      });

      console.log('\n📋 Data in Users Info sheet:');
      if (response.data.values) {
        response.data.values.forEach((row, index) => {
          console.log(`Row ${index + 1}:`, row);
        });
      } else {
        console.log('No data found in Users Info sheet');
      }
    } else {
      console.log('❌ "Users Info" sheet not found');
      console.log('Available sheet names:', spreadsheet.data.sheets.map(s => s.properties.title));
    }

  } catch (error) {
    console.error('❌ Error checking sheet structure:', error.message);
  }
}

checkSheetStructure();

