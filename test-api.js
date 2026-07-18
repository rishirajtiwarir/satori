const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/v1/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const token = JSON.parse(data).token;
    if (!token) {
        console.log("No token:", data);
        return;
    }
    console.log("Got token:", token);
    
    // Now request lists
    const listReq = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/vocabulary/lists',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        console.log("Lists status:", res2.statusCode);
        console.log("Lists response:", data2);
        
        if (res2.statusCode !== 200) return;
        
        // Try creating a list
        const createReq = http.request({
          hostname: 'localhost',
          port: 8080,
          path: '/api/v1/vocabulary/lists',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }, (res3) => {
            let data3 = '';
            res3.on('data', chunk => data3 += chunk);
            res3.on('end', () => {
                console.log("Create List status:", res3.statusCode);
                console.log("Create List response:", data3);
            });
        });
        createReq.write(JSON.stringify({ name: "test_list" }));
        createReq.end();
      });
    });
    listReq.end();
  });
});

req.write(JSON.stringify({
  name: "test user",
  email: `test${Date.now()}@example.com`,
  password: "password",
  role: "USER"
}));
req.end();
