const arweave = require('../config/config').arweave
function publish(folder){
console.log('folder: ',folder)
if(folder){
    let transaction = await arweave.createTransaction({
        data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>',
    }, key);
}
else{
    
}
}