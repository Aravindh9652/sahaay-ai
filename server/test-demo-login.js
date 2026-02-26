const http = require('http');

function testLogin() {
  const loginData = JSON.stringify({
    email: 'testuser@example.com',
    password: 'testpass123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  console.log('Testing Demo Account Login...\n');

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Response Status:', res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log('\nResponse:');
        console.log(JSON.stringify(response, null, 2));

        if (response.ok && response.token) {
          console.log('\n✅ Demo Login SUCCESS!');
          console.log('Token (first 50 chars):', response.token.substring(0, 50) + '...');
          
          // Test retrieving profile
          setTimeout(() => {
            testProfile(response.token);
          }, 500);
        } else {
          console.log('\n❌ Demo Login FAILED');
        }
      } catch (e) {
        console.log('Raw Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request Error:', error);
  });

  req.write(loginData);
  req.end();
}

function testProfile(token) {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/profile',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  console.log('\n\nTesting Profile Retrieval...\n');

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Response Status:', res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log('\nProfile Response:');
        console.log(JSON.stringify(response, null, 2));

        if (response.profile) {
          console.log('\n✅ Profile Retrieval SUCCESS!');
        } else {
          console.log('\n❌ Profile Retrieval FAILED');
        }
      } catch (e) {
        console.log('Raw Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request Error:', error);
  });

  req.end();
}

testLogin();
