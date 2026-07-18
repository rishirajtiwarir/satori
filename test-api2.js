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
    
    // First GET lists (empty -> creates Favorites)
    const listReq = http.request({
      hostname: 'localhost', port: 8080, path: '/api/v1/vocabulary/lists', method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (res2) => {
        // Now POST a new list
        const createReq = http.request({
          hostname: 'localhost', port: 8080, path: '/api/v1/vocabulary/lists', method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }, (res3) => {
            // Now GET lists again! (not empty)
            const listReq2 = http.request({
              hostname: 'localhost', port: 8080, path: '/api/v1/vocabulary/lists', method: 'GET',
              headers: { 'Authorization': `Bearer ${token}` }
            }, (res4) => {
              let data4 = '';
              res4.on('data', chunk => data4 += chunk);
              res4.on('end', () => {
                console.log("Final GET lists status:", res4.statusCode);
                console.log("Final GET lists response:", data4);
              });
            });
            listReq2.end();
        });
        createReq.write(JSON.stringify({ name: "test_list" }));
        createReq.end();
    });
    listReq.end();
  });
});

req.write(JSON.stringify({
  name: "test user", email: `test${Date.now()}@example.com`, password: "password", role: "USER"
}));
req.end();
