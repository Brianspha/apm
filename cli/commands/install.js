const config = require('../config/config')
const arql = require('arql-ops')
async function getPackages(packages) {
    console.log('packages: ', packages)
    if (packages.length > 0) {
        var expressions = await Promise.resolve(formulateExpressions(packages))
        config.arweave.arql(expressions).then((transactionIds) => {
            console.log('ids: ', transactionIds)
        })
        const transaction = config.arweave.transactions.getData('SPhg98JDns_2UDlVXSOxawNysDFou2YOUdGdum2ERg4').then(t => {
            console.log('transaction: ', t)
        })
    }
    else {
        const Arweave = require('arweave/node');

        const arweave = Arweave.init({
            host: 'arweave.net',// Hostname or IP address for a Arweave host
            port: 443,          // Port
            protocol: 'https',  // Network protocol http or https
            timeout: 20000,     // Network request timeouts in milliseconds
            logging: false,     // Enable network request logging
        });

        let key = await arweave.wallets.generate();

        // Plain text
        let transaction = await arweave.createTransaction({
            data: '<html><head><meta charset="UTF-8"><title>Hello world!</title></head><body></body></html>'
        }, key);
        transaction.addTag('Content-Type', 'text/html');
        transaction.addTag('package', 'html');
        await arweave.transactions.sign(transaction, key);
        const response = await arweave.transactions.post(transaction);

        console.log('transaction: ', transaction,' response: ',response)
        console.log('installing packages from package.json')
    }
}
function formulateExpressions(packages) {
    return new Promise((resolve) => {
        packages.map((package) => {
            console.log('package: ', package)
            const query = arql.or(
                arql.equals('package', package),
            );
            console.log(query)
            resolve(query)
        })
    })

}
const [, , ...args] = process.argv;

getPackages(args)