let fs = require('fs');

let userName:String = 'Steve';

fs.writeFile('temp/user-data.txt', 'Name: ' + userName, (errr) =>{
    if(errr){
        console.log(errr);
        return;
    }
    console.log('WROTE FILE');
} ); 