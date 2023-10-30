const http = require('http');

const server = http.createServer((req, res) => {
    console.log('INCOMING REQUEST');
    console.log(req.method, req.url);

    if (req.method === 'POST') {
        let body:String = '';
        req.on('end', () => {
            console.log(body);
            const userName = body.split('=')[1];
            res.end('<h1>' + userName + ' </h1>');
        })
        req.on('data', (chunk) => {
            body += chunk;
        });
    } else {
        res.setHeader('Content-Type', 'text/html')
        res.end('<form method="POST"><input type="text" name="username"><button type="submit"> Create User</button></form>')
    }
    
    // res.setHeader('Content-Type', 'text/plain')
    // res.end('<h1>Success!</h1>');
});

server.listen(5000);