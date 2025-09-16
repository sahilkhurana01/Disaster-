const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing Disaster Management API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test cities endpoint
    console.log('\n2. Testing cities endpoint...');
    const citiesResponse = await fetch(`${API_BASE}/cities`);
    const citiesData = await citiesResponse.json();
    console.log('✅ Cities loaded:', citiesData.cities.length, 'cities');
    console.log('   Sample cities:', citiesData.cities.slice(0, 5).join(', '));

    // Test areas endpoint
    console.log('\n3. Testing areas endpoint...');
    const testCity = citiesData.cities[0];
    const areasResponse = await fetch(`${API_BASE}/cities/${encodeURIComponent(testCity)}/areas`);
    const areasData = await areasResponse.json();
    console.log(`✅ Areas for ${testCity}:`, areasData.areas.length, 'areas');
    console.log('   Sample areas:', areasData.areas.slice(0, 3).join(', '));

    // Test alert submission
    console.log('\n4. Testing alert submission...');
    const alertData = {
      phoneNumber: '9876543210',
      city: testCity,
      area: areasData.areas[0],
      alertType: 'yellow',
      description: 'Test emergency alert',
      severity: 'medium'
    };

    const alertResponse = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData)
    });

    const alertResult = await alertResponse.json();
    if (alertResult.success) {
      console.log('✅ Alert submitted successfully');
      console.log('   Alert data:', alertResult.data);
    } else {
      console.log('❌ Alert submission failed:', alertResult.error);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running:');
    console.log('   cd Backend && npm install && npm start');
  }
}

testAPI();


