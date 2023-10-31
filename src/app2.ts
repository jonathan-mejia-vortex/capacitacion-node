import * as http from 'http';

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log('INCOMING REQUEST');
  console.log(req.method, req.url);

  if (req.method === 'POST') {
    let body = '';
    req.on('end', () => {
      const userName = body.split('=')[1];
      res.end('<h1>' + userName + '</h1>');
    });

    req.on('data', (chunk) => {
      body += chunk;
    });
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.end(
      '<form method="POST"><input type="text" name="username"><button type="submit">Create User</button></form>'
    );
  }
});

server.listen(5000);