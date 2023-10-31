import * as http from 'http';

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log('INCOMING REQUEST');
  console.log(req.method, req.url);

  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Success!</h1>');
});

server.listen(5000);