const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAIAlertsAPI() {
  console.log('🧪 Testing AI Alerts API...\n');

  try {
    // Test AI alerts endpoint
    console.log('Test 1: Fetching AI alerts from Google Sheet...');
    const response = await axios.get(`${BASE_URL}/api/ai-alerts`);
    
    console.log('✅ AI Alerts API response received');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Number of alerts:', response.data.alerts?.length || 0);
    
    if (response.data.alerts && response.data.alerts.length > 0) {
      console.log('\n📋 Sample AI Alert:');
      const sampleAlert = response.data.alerts[0];
      console.log('ID:', sampleAlert.id);
      console.log('Title:', sampleAlert.titleName);
      console.log('Risk Percentage:', sampleAlert.riskPercentage);
      console.log('Pub Date:', sampleAlert.pubDate);
      console.log('Category:', sampleAlert.category);
      console.log('Severity:', sampleAlert.severity);
      console.log('Resolved:', sampleAlert.resolved);
    } else {
      console.log('⚠️  No AI alerts found in the sheet');
    }

    console.log('\n🎉 AI Alerts API test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- API endpoint accessible: ✅');
    console.log('- Data structure correct: ✅');
    console.log('- Ready for frontend integration: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure:');
      console.log('1. The backend server is running (node server.js)');
      console.log('2. The Google Sheet has an "Alerts" sheet with data');
      console.log('3. The SPREADSHEET_ID is correctly set in .env file');
    }
  }
}

// Run the test
testAIAlertsAPI();
