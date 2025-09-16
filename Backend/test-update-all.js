const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

// Google Sheets configuration
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'disaster-management312-be80c55826f0.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function testUpdateAll() {
  try {
    console.log('Testing update ALL matching records logic...');
    
    // Test data - this should update ALL records with Punjabi Bagh, Ludhiana
    const testData = {
      phoneNumber: '9999999999',
      city: 'Ludhiana',
      area: 'Punjabi Bagh',
      alertType: 'yellow'
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

    // Check if records with same Area and City exist
    const matchingRows = [];
    for (let i = 1; i < existingData.length; i++) { // Skip header row
      const row = existingData[i];
      if (row.length >= 3 && row[1] === testData.area && row[2] === testData.city) {
        matchingRows.push(i + 1); // +1 because Google Sheets is 1-indexed
        console.log(`Found matching record at row ${i + 1}:`, row);
      }
    }

    if (matchingRows.length > 0) {
      console.log(`\nFound ${matchingRows.length} matching records, updating all...`);
      
      for (const rowIndex of matchingRows) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.SPREADSHEET_ID,
          range: `Users Info!D${rowIndex}`,
          valueInputOption: 'RAW',
          resource: {
            values: [[testData.alertType]]
          }
        });
        console.log(`✅ Updated record at row ${rowIndex} with alert type: ${testData.alertType}`);
      }
      
      console.log(`\n🎉 Successfully updated ${matchingRows.length} records with alert type: ${testData.alertType}`);
    } else {
      console.log('❌ No matching records found');
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
    console.error('❌ Error testing update all logic:', error.message);
  }
}

testUpdateAll();

