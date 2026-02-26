const http = require('http');

function testPrimaryDemoLogin() {
  const loginData = JSON.stringify({
    email: 'demo@sahaay.com',
    password: 'demo123'
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

  console.log('Testing PRIMARY Demo Account...\n');
  console.log('Email:    demo@sahaay.com');
  console.log('Password: demo123\n');

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Response Status:', res.statusCode);
      try {
        const response = JSON.parse(data);
        
        if (response.ok && response.token) {
          console.log('\n✅ PRIMARY DEMO ACCOUNT LOGIN SUCCESS!');
          console.log('\nUser Details:');
          console.log('  ID:    ', response.user.id);
          console.log('  Name:  ', response.user.name);
          console.log('  Email: ', response.user.email);
          console.log('\nToken (first 50 chars):', response.token.substring(0, 50) + '...');
        } else {
          console.log('\n❌ PRIMARY DEMO ACCOUNT LOGIN FAILED');
          console.log('Response:', response);
        }
      } catch (e) {
        console.log('Parse Error:', e.message);
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

testPrimaryDemoLogin();
