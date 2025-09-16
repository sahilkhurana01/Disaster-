const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testDescriptionFunctionality() {
  console.log('🧪 Testing Alert Description Functionality...\n');

  try {
    // Test 1: Submit alert with description
    console.log('Test 1: Submitting alert with description...');
    const alertWithDescription = {
      phoneNumber: '+919876543210',
      city: 'Amritsar',
      area: 'Golden Temple Area',
      alertType: 'Fire Emergency',
      description: 'Major fire outbreak near Golden Temple, multiple buildings affected. Immediate evacuation required.',
      severity: 'high'
    };

    const response1 = await axios.post(`${BASE_URL}/api/alerts`, alertWithDescription);
    console.log('✅ Alert with description submitted successfully');
    console.log('Response:', response1.data);
    console.log('');

    // Test 2: Submit alert without description
    console.log('Test 2: Submitting alert without description...');
    const alertWithoutDescription = {
      phoneNumber: '+919876543211',
      city: 'Ludhiana',
      area: 'Model Town',
      alertType: 'Medical Emergency',
      severity: 'medium'
    };

    const response2 = await axios.post(`${BASE_URL}/api/alerts`, alertWithoutDescription);
    console.log('✅ Alert without description submitted successfully');
    console.log('Response:', response2.data);
    console.log('');

    // Test 3: Submit alert with empty description
    console.log('Test 3: Submitting alert with empty description...');
    const alertWithEmptyDescription = {
      phoneNumber: '+919876543212',
      city: 'Jalandhar',
      area: 'Civil Lines',
      alertType: 'Traffic Accident',
      description: '',
      severity: 'low'
    };

    const response3 = await axios.post(`${BASE_URL}/api/alerts`, alertWithEmptyDescription);
    console.log('✅ Alert with empty description submitted successfully');
    console.log('Response:', response3.data);
    console.log('');

    // Test 4: Update existing record with new description
    console.log('Test 4: Updating existing record with new description...');
    const updateAlert = {
      phoneNumber: '+919876543210',
      city: 'Amritsar',
      area: 'Golden Temple Area',
      alertType: 'Fire Emergency - Update',
      description: 'Fire has been contained, but area still needs to be evacuated for safety.',
      severity: 'medium'
    };

    const response4 = await axios.post(`${BASE_URL}/api/alerts`, updateAlert);
    console.log('✅ Existing record updated with new description');
    console.log('Response:', response4.data);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Alert with description: ✅');
    console.log('- Alert without description: ✅');
    console.log('- Alert with empty description: ✅');
    console.log('- Update existing record with description: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testDescriptionFunctionality();
