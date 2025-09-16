const { google } = require('googleapis');
const path = require('path');

// Google Sheets configuration
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'disaster-management312-be80c55826f0.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function createUsersInfoSheet() {
  try {
    // Create a new spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: 'Disaster Management - Users Info'
        },
        sheets: [{
          properties: {
            title: 'Users Info',
            gridProperties: {
              rowCount: 1000,
              columnCount: 10
            }
          }
        }]
      }
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    console.log('✅ Created new spreadsheet with ID:', spreadsheetId);
    console.log('📊 Spreadsheet URL:', `https://docs.google.com/spreadsheets/d/${spreadsheetId}`);

    // Add headers to the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'Users Info!A1:H1',
      valueInputOption: 'RAW',
      resource: {
        values: [[
          'Timestamp',
          'Phone Number',
          'City',
          'Area',
          'Alert Type',
          'Description',
          'Severity',
          'Status'
        ]]
      }
    });

    console.log('✅ Added headers to the sheet');

    // Format the header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: {
        requests: [{
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.2,
                  green: 0.4,
                  blue: 0.8
                },
                textFormat: {
                  foregroundColor: {
                    red: 1,
                    green: 1,
                    blue: 1
                  },
                  bold: true
                }
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)'
          }
        }]
      }
    });

    console.log('✅ Formatted header row');

    // Set up environment variable
    console.log('\n🔧 Add this to your .env file:');
    console.log(`SPREADSHEET_ID=${spreadsheetId}`);

    return spreadsheetId;

  } catch (error) {
    console.error('❌ Error creating spreadsheet:', error);
    throw error;
  }
}

// Run the setup
createUsersInfoSheet()
  .then((spreadsheetId) => {
    console.log('\n🎉 Setup complete! Your Users Info sheet is ready.');
    console.log('📝 Next steps:');
    console.log('1. Copy the SPREADSHEET_ID above');
    console.log('2. Create a .env file in the Backend folder');
    console.log('3. Add: SPREADSHEET_ID=your_spreadsheet_id_here');
    console.log('4. Restart the backend server');
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });

