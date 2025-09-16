const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Google Sheets configuration
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'disaster-management312-be80c55826f0.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Punjab cities and their areas data
const punjabData = {
  "Amritsar": [
    "Golden Temple Area", "Hall Bazaar", "Lawrence Road", "Mall Road", "Cantonment",
    "Ranjit Avenue", "Green Avenue", "Batala Road", "Majitha Road", "Tarn Taran Road"
  ],
  "Ludhiana": [
    "Model Town", "Sarabha Nagar", "Civil Lines", "Gill Road", "Ferozepur Road",
    "Dugri", "Kitchlu Nagar", "BRS Nagar", "Punjabi Bagh", "Jalandhar Bypass"
  ],
  "Jalandhar": [
    "Model Town", "Nakodar Road", "Kapurthala Road", "Adampur", "Cantonment",
    "Basti Sheikh", "Guru Teg Bahadur Nagar", "Urban Estate", "Ladowali Road", "Nakodar Road"
  ],
  "Patiala": [
    "Leela Bhawan", "Model Town", "Rajindra Hospital", "Tripuri", "Adalat Bazaar",
    "Anardana Chowk", "Baradari Garden", "Dharampura Bazaar", "Ghalori Gate", "Sheranwala Gate"
  ],
  "Bathinda": [
    "Model Town", "Guru Nanak Dev Thermal Plant", "Cantonment", "Civil Lines",
    "Guru Teg Bahadur Nagar", "Rose Garden", "Mall Road", "Bibiwala Road", "Goniana Road"
  ],
  "Mohali": [
    "Phase 1", "Phase 2", "Phase 3A", "Phase 3B", "Phase 4", "Phase 5", "Phase 6",
    "Phase 7", "Phase 8", "Phase 9", "Phase 10", "Sector 70", "Sector 71", "Sector 72"
  ],
  "Chandigarh": [
    "Sector 1-10", "Sector 11-20", "Sector 21-30", "Sector 31-40", "Sector 41-50",
    "Sector 51-60", "Sector 61-70", "Sector 71-80", "Sector 81-90", "Sector 91-100"
  ],
  "Firozpur": [
    "Cantonment", "Model Town", "Guru Teg Bahadur Nagar", "Civil Lines",
    "Railway Road", "Basti Sheikh", "Mall Road", "Ferozepur Road", "Abohar Road"
  ],
  "Batala": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Batala Road", "Qadian Road", "Gurdaspur Road"
  ],
  "Moga": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Moga Road", "Barnala Road", "Ferozepur Road"
  ],
  "Abohar": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Abohar Road", "Fazilka Road", "Sri Ganganagar Road"
  ],
  "Malout": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Malout Road", "Muktsar Road", "Bathinda Road"
  ],
  "Muktsar": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Muktsar Road", "Malout Road", "Bathinda Road"
  ],
  "Faridkot": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Faridkot Road", "Muktsar Road", "Bathinda Road"
  ],
  "Mansa": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Mansa Road", "Bathinda Road", "Barnala Road"
  ],
  "Barnala": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Barnala Road", "Mansa Road", "Sangrur Road"
  ],
  "Sangrur": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Sangrur Road", "Barnala Road", "Patiala Road"
  ],
  "Sunam": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Sunam Road", "Sangrur Road", "Patiala Road"
  ],
  "Rajpura": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Rajpura Road", "Patiala Road", "Chandigarh Road"
  ],
  "Nabha": [
    "Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar",
    "Railway Road", "Mall Road", "Nabha Road", "Patiala Road", "Rajpura Road"
  ]
};

// Routes

// Get Punjab cities
app.get('/api/cities', (req, res) => {
  try {
    const cities = Object.keys(punjabData);
    res.json({ success: true, cities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get areas for a specific city
app.get('/api/cities/:city/areas', (req, res) => {
  try {
    const { city } = req.params;
    const areas = punjabData[city] || [];
    res.json({ success: true, areas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit alert (with fallback if Google Sheets not available)
app.post('/api/alerts', async (req, res) => {
  try {
    const { phoneNumber, city, area, alertType, description, severity } = req.body;

    // Validate required fields
    if (!phoneNumber || !city || !area || !alertType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phoneNumber, city, area, alertType'
      });
    }

    const alertData = {
      timestamp: new Date().toISOString(),
      phoneNumber,
      city,
      area,
      alertType,
      description: description || '',
      severity: severity || 'medium',
      status: 'pending'
    };

    // Try to submit to Google Sheets if configured
    if (process.env.SPREADSHEET_ID && process.env.SPREADSHEET_ID !== 'your_spreadsheet_id_here') {
      try {
        // Read existing data from Users Info sheet
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.SPREADSHEET_ID,
          range: 'Users Info!A:E',
        });

        const existingData = response.data.values || [];
        console.log('Existing data rows:', existingData.length);

        // Check if records with same Area and City exist
        const matchingRows = [];
        for (let i = 1; i < existingData.length; i++) { // Skip header row
          const row = existingData[i];
          if (row.length >= 3 && row[2] === area && row[3] === city) {
            matchingRows.push(i + 1); // +1 because Google Sheets is 1-indexed
            console.log(`Found matching record at row ${i + 1}:`, row);
          }
        }

        if (matchingRows.length > 0) {
          // Update ALL existing records - update Alert Type column (D) and Description column (E) for each
          console.log(`Found ${matchingRows.length} matching records, updating all...`);
          
          for (const rowIndex of matchingRows) {
            // Update Alert Type (Column D)
            await sheets.spreadsheets.values.update({
              spreadsheetId: process.env.SPREADSHEET_ID,
              range: `Users Info!D${rowIndex}`,
              valueInputOption: 'RAW',
              resource: {
                values: [[alertType]]
              }
            });
            
            // Update Description (Column E)
            await sheets.spreadsheets.values.update({
              spreadsheetId: process.env.SPREADSHEET_ID,
              range: `Users Info!E${rowIndex}`,
              valueInputOption: 'RAW',
              resource: {
                values: [[description || '']]
              }
            });
            
            console.log(`Updated record at row ${rowIndex} with alert type: ${alertType} and description: ${description || 'N/A'}`);
          }
          
          console.log(`Successfully updated ${matchingRows.length} records with alert type: ${alertType} and description`);
        } else {
          // Add new record
          const newRecord = [
            phoneNumber,    // Phone No. (Column A)
            area,          // Area (Column B)
            city,          // City (Column C)
            alertType,     // Alerts Type (Column D)
            description || '' // Description (Column E)
          ];

          await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'Users Info!A:E',
            valueInputOption: 'RAW',
            resource: { values: [newRecord] }
          });

          console.log('Added new record to Users Info sheet:', newRecord);
        }

        console.log('Alert processed in Google Sheets successfully');
      } catch (sheetsError) {
        console.warn('Google Sheets submission failed, storing locally:', sheetsError.message);
        // Store in memory as fallback
        if (!global.alertStorage) global.alertStorage = [];
        global.alertStorage.unshift(alertData);
        global.alertStorage = global.alertStorage.slice(0, 100); // Keep last 100
      }
    } else {
      console.log('Google Sheets not configured, storing locally');
      // Store in memory as fallback
      if (!global.alertStorage) global.alertStorage = [];
      global.alertStorage.unshift(alertData);
      global.alertStorage = global.alertStorage.slice(0, 100); // Keep last 100
    }

    res.json({
      success: true,
      message: 'Alert submitted successfully',
      data: alertData
    });

  } catch (error) {
    console.error('Error submitting alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit alert'
    });
  }
});

// Get all alerts from Google Sheets
app.get('/api/alerts', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A:H',
    });

    const rows = response.data.values || [];
    const headers = rows[0] || [];
    const alerts = rows.slice(1).map(row => {
      const alert = {};
      headers.forEach((header, index) => {
        alert[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || '';
      });
      return alert;
    });

    res.json({
      success: true,
      alerts
    });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts from Google Sheets'
    });
  }
});

// Get AI alerts from Google Sheets
app.get('/api/ai-alerts', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Alerts!A:D',
    });

    const rows = response.data.values || [];
    const headers = rows[0] || [];
    
    // Find column indices
    const pubDateIndex = headers.findIndex(h => h.toLowerCase().includes('pubdate') || h.toLowerCase().includes('date'));
    const riskIndex = headers.findIndex(h => h.toLowerCase().includes('risk') || h.toLowerCase().includes('percentage'));
    const titleIndex = headers.findIndex(h => h.toLowerCase().includes('title') || h.toLowerCase().includes('name'));
    
    const aiAlerts = rows.slice(1).map((row, index) => {
      const alert = {
        id: `ai-${index + 1}`,
        pubDate: row[pubDateIndex] || '',
        riskPercentage: parseFloat(row[riskIndex]) || 0,
        titleName: row[titleIndex] || '',
        timestamp: new Date().toISOString(),
        category: 'critical',
        severity: (parseFloat(row[riskIndex]) || 0) / 100,
        resolved: false
      };
      return alert;
    }).filter(alert => alert.titleName && alert.titleName.trim() !== '');

    res.json({
      success: true,
      alerts: aiAlerts
    });

  } catch (error) {
    console.error('Error fetching AI alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch AI alerts from Google Sheets'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Disaster Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Disaster Management API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

