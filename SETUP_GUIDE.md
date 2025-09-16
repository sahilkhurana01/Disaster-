# Punjab Disaster Management System - Setup Guide

## Overview
This system allows users to submit safety alerts for Punjab cities and areas, with data stored in Google Sheets.

## Backend Setup

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Set up Google Sheets
```bash
# Create a new Google Sheet and get the ID
node setup-sheet.js
```

### 3. Configure Environment
Create a `.env` file in the Backend directory:
```
PORT=5000
SPREADSHEET_ID=your_spreadsheet_id_from_step_2
```

### 4. Start Backend Server
```bash
npm start
# or for development
npm run dev
```

### 5. Test Backend
```bash
node test-api.js
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Start Frontend
```bash
npm run dev
```

## Features

### Safety Alert Dialog
- **Phone Number**: Required field for contact information
- **City Selection**: Dropdown with all Punjab cities
- **Area Selection**: Dynamic dropdown based on selected city
- **Alert Type**: Yellow (Warning) or Red (Critical) alerts
- **Severity Level**: Low, Medium, or High
- **Description**: Optional detailed description

### Punjab Cities Included
- Amritsar, Ludhiana, Jalandhar, Patiala, Bathinda
- Mohali, Chandigarh, Firozpur, Batala, Moga
- Abohar, Malout, Muktsar, Faridkot, Mansa
- Barnala, Sangrur, Sunam, Rajpura, Nabha

### Google Sheets Integration
- Automatic data submission to Google Sheets
- Real-time alert tracking
- Structured data with timestamps

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/cities` - Get all Punjab cities
- `GET /api/cities/:city/areas` - Get areas for specific city
- `POST /api/alerts` - Submit new alert
- `GET /api/alerts` - Get all alerts

## Usage

1. Open the Safety Alert page
2. Click the emergency button (red pulsing button)
3. Fill in the required information:
   - Phone number
   - Select city from dropdown
   - Select area from dropdown (populated based on city)
   - Choose alert type (Yellow/Red)
   - Set severity level
   - Add description (optional)
4. Click "Submit Alert"
5. Alert will be saved to Google Sheets and displayed on the map

## Troubleshooting

### Backend Issues
- Ensure Google Sheets service account has proper permissions
- Check that SPREADSHEET_ID is correct in .env file
- Verify backend is running on port 5000

### Frontend Issues
- Ensure backend is running before starting frontend
- Check browser console for API connection errors
- Verify CORS settings if running on different ports

### Google Sheets Issues
- Ensure the service account email has edit access to the sheet
- Check that the sheet has the correct headers in row 1
- Verify the sheet ID is correct


