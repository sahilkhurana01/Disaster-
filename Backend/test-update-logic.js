const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

// Google Sheets configuration
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'disaster-management312-be80c55826f0.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function testUpdateLogic() {
  try {
    console.log('Testing update logic for Users Info sheet...');
    
    // Test data - this should update existing record
    const testData = {
      phoneNumber: '7087780200',
      city: 'Ludhiana',
      area: 'Punjabi Bagh',
      alertType: 'red'
    };

    // Read existing data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Users Info!A:D',
    });

    const existingData = response.data.values || [];
    console.log('Current data in Users Info sheet:');
    existingData.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });

    // Check if record with same Area and City exists
    let foundRowIndex = -1;
    for (let i = 1; i < existingData.length; i++) { // Skip header row
      const row = existingData[i];
      if (row.length >= 3 && row[1] === testData.area && row[2] === testData.city) {
        foundRowIndex = i + 1; // +1 because Google Sheets is 1-indexed
        console.log(`\n✅ Found existing record at row ${foundRowIndex}:`, row);
        break;
      }
    }

    if (foundRowIndex > 0) {
      // Update existing record
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: `Users Info!D${foundRowIndex}`,
        valueInputOption: 'RAW',
        resource: {
          values: [[testData.alertType]]
        }
      });

      console.log(`✅ Updated existing record at row ${foundRowIndex} with alert type: ${testData.alertType}`);
    } else {
      console.log('❌ No existing record found, would add new record');
    }

    // Read data again to verify
    const updatedResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Users Info!A:D',
    });

    console.log('\nUpdated data in Users Info sheet:');
    updatedResponse.data.values.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });

  } catch (error) {
    console.error('❌ Error testing update logic:', error.message);
  }
}

testUpdateLogic();

