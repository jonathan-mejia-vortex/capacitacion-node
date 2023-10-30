const expr = require('express');
const appExpr = expr();

appExpr.use((req, res, next) => {
    let body:String = '';
    req.on('end', () => {
        const userName = body.split('=')[1];
        if(userName){
            req.body = { name: userName };
        }
        next();
    })
    req.on('data', (chunk) => {
        body += chunk;
    });
});

appExpr.use((req, res, next) => {
    if(req.body){
        return res.send('<h1> User: ' + req.body.name + '</h1>');
    }
    res.send('<form method="POST"><input type="text" name="username"><button type="submit"> Create User</button></form>')
});

appExpr.listen(5000);