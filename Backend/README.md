# Disaster Management Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the Backend directory with:
```
PORT=5000
SPREADSHEET_ID=your_google_sheets_id_here
```

3. Get your Google Sheets ID:
   - Create a new Google Sheet
   - Copy the ID from the URL (the long string between /d/ and /edit)
   - Add headers in the first row: Timestamp, Phone Number, City, Area, Alert Type, Description, Severity, Status

4. Run the server:
```bash
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/cities` - Get all Punjab cities
- `GET /api/cities/:city/areas` - Get areas for a specific city
- `POST /api/alerts` - Submit a new alert
- `GET /api/alerts` - Get all alerts

## Alert Submission Format

```json
{
  "phoneNumber": "9876543210",
  "city": "Amritsar",
  "area": "Golden Temple Area",
  "alertType": "red",
  "description": "Emergency situation",
  "severity": "high"
}
```


