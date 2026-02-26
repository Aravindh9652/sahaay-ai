const http = require('http');

// Test 1: Signup
const signupData = JSON.stringify({
  name: "Test User 2",
  email: "testuser2@example.com",
  password: "testpass123",
  phone: "+1234567890",
  location: "Test City",
  language: "en"
});

const signupOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': signupData.length
  }
};

console.log('Testing Signup Endpoint...');
const signupReq = http.request(signupOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Signup Response Status:', res.statusCode);
    const response = JSON.parse(data);
    console.log('Signup Response:', JSON.stringify(response, null, 2));
    
    // Test 2: Login with same user
    if (response.ok) {
      setTimeout(() => {
        loginTest(response.user.email);
      }, 1000);
    }
  });
});

signupReq.on('error', (error) => {
  console.error('Signup Error:', error);
});

signupReq.write(signupData);
signupReq.end();

// Test login
function loginTest(email) {
  const loginData = JSON.stringify({
    email: email,
    password: "testpass123"
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  console.log('\nTesting Login Endpoint...');
  const loginReq = http.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Login Response Status:', res.statusCode);
      const response = JSON.parse(data);
      console.log('Login Response:', JSON.stringify(response, null, 2));
      
      // Test 3: Get Profile with token
      if (response.ok && response.token) {
        setTimeout(() => {
          getProfileTest(response.token);
        }, 1000);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error('Login Error:', error);
  });

  loginReq.write(loginData);
  loginReq.end();
}

// Test get profile
function getProfileTest(token) {
  const profileOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/profile',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  console.log('\nTesting Profile Endpoint...');
  const profileReq = http.request(profileOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Profile Response Status:', res.statusCode);
      const response = JSON.parse(data);
      console.log('Profile Response:', JSON.stringify(response, null, 2));
      console.log('\n=== All API Tests Completed ===');
    });
  });

  profileReq.on('error', (error) => {
    console.error('Profile Error:', error);
  });

  profileReq.end();
}