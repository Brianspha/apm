const { program } = require('commander');
const path = require('platform-folders')
const createFile = require('create-file');
const NodeCache = require("node-cache");
const Arweave = require('arweave/node');
const readjson = require('readjson');
const ora = require('ora')
let spinner = ora()
var tarGzip = require('node-targz');
var fs = require('fs');
const colors = require('colors')
// node cachemanager
var Cache = require('file-system-cache').default;
const cache = Cache({
    basePath: "./.cache", // Optional. Path where cache files are stored (default).
});
const arweave = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
});
program
    .version('0.0.1')
    .command('install [name]', 'install one or more packages', { executableFile: '../cli/commands/install' })
    .alias('i')
    .option('-f, --force', 'force')
    .command('help', 'outputs all commands', { executableFile: '../cli/commands/help' }, { isDefault: true })
    .alias('h')
    .usage('help')
    .command('list', 'list packages installed', { executableFile: '../cli/commands/list' })
    .alias('ls')
    .usage('list')
    .command('publish', 'publish the package to arweave', { executableFile: '../cli/commands/publish' })
    .alias('p')
    .usage('publish')
    .command('login', 'login with your arweave wallet', { executableFile: '../cli/commands/login' })
    .alias('l')
    .usage('login')
    .command('view', 'view all packages with their authors', { executableFile: '../cli/commands/view' })
    .alias('v')
    .usage(' view')
    .command('uninstall [name]', 'uninstall a package or packages', { executableFile: '../cli/commands/uninstall' })
    .usage('uninstall [name] [--force,-force, force]')
    .alias('u')
    .command('init', 'initialise package.json file compatible with npm', { executableFile: '../cli/commands/init' })
    .on('command:*', function (operands) {
        console.error(`error: unknown command '${operands[0]}'`);
        const availableCommands = program.commands.map(cmd => cmd.name());
        mySuggestBestMatch(operands[0], availableCommands);
        console.log(program.helpInformation())
        process.exitCode = 1;
    })
    .usage('apm command [--force, -f, force]')

function mySuggestBestMatch(arg, commands) {
    var message = `Did you mean?\n\n`
    var found = false
    commands.map((command) => {
        if (command.includes(arg)) {
            message += command + '\n'
            found = true
        }
    })
    if (found) {
        console.log(message)
    }
    else {
        program.helpInformation()
    }
}

function saveFile(fileName, contents) {
    createFile(`${path.getDesktopFolder()}/arweave/${fileName}.json`, `${contents}`, (error) => {
        if (error) {
            console.error('error: ', error)
        }
    })
}
async function getFile(fileName) {
    return new Promise(async (resolve) => {
        const json = await readjson(`${path.getDesktopFolder()}/arweave/${fileName}.json`);
        resolve(json)
    })
}
function savePackageJSON(contents) {
    createFile(`../apm.json`, `${contents}`, (error) => {
        if (error) {
            console.error('error: ', error)
        }
    })
}
async function readJSON() {
    return new Promise(async (resolve) => {
        const json = await readjson('../apm.json');
        resolve(json)
    })

}
function saveCache(values) {
    cache.set(values[0], values[1])
        .then(result => {
            console.log('saved cache')
        })
}
function getCache(key) {
    return new Promise((resolve) => {
        cache.get(key)
            .then(result => {
                console.log(result);
                resolve(result)
            })
            .catch(err => {
                resolve({})
                console.error(err)
            });
    })

}

async function zipFolder(from, to) {
    return new Promise((resolve) => {
        console.log(colors.green('Packaging Package folder please wait ..'))
        tarGzip.compress({
            source: from,
            destination: to,
        }, (error, completed) => {
            console.log('error: ', error, ' completed: ', completed)
            if (error) {
                console.log(colors.red('Packaging Error...'))
                process.exit(0)
            }
            else {
                spinner.succeed('Packaging completed...')
                spinner.stop()
                resolve(true)
            }
        })
    })
}
async function uploadToArweave(privateKey, packageName) {
    return new Promise(async (resolve) => {
        var package = await Promise.resolve((getPackageFile(packageName)))
        if (!package.found) {
            console.error(colors.red(`Package Zip file not found please ensure its in the root directory of this project or run ${colors.yellow('apm publish')}`))
            resolve({})
            process.exit(0)
        }
        else {
            console.log('packageFile: ', package.file, ' key: ', privateKey, ' packageName: ', packageName)
            let transaction = await arweave.createTransaction({
                data: package.file,
            }, privateKey.privateKey);
            // transaction.addTag('Content-Type', 'application/zip');
            transaction.addTag('APM', packageName);
            console.log('tx: ', transaction)
            var tx = await arweave.transactions.sign(transaction, privateKey.privateKey);
            const response = await arweave.transactions.post(tx);
            console.log(tx, '\n\n\n', `Status Code: ${colors.green(response.status)}`)
            if (response.status === 500) {
                var balance = await Promise.resolve(getUserBalance(privateKey.privateKey))
                console.log(colors.red(`Please ensure you have enough AR tokens your current balance is ${balance} AR`))
            }
            resolve(tx)
        }
    })
}
async function keyToAddress(key) {
    return new Promise((resolve) => {
        arweave.wallets.jwkToAddress(key).then((address) => {
            console.log(address);
            resolve(address)
            //1seRanklLU_1VTGkEk7P0xAwMJfA7owA1JHW5KyZKlY
        });
    })
}
async function getUserBalance(key) {
    return new Promise(async(resolve) => {
        var address = await Promise.resolve(keyToAddress(key))
        arweave.wallets.getBalance(address).then((balance) => {
            let winston = balance;
            let ar = arweave.ar.winstonToAr(balance);
            console.log('balance in winston: ', winston);
            console.log('balance in ar ', ar);
            resolve(ar)
        });
    })
}
async function getPackageFile(packageName) {
    return new Promise((resolve) => {
        fs.readFile(`../${packageName}.tar.gz`, function (err, data) {
            if (err) {
                console.log(err)
                resolve({ file: null, found: false })
            }
            else {
                resolve({ file: data, found: true })
                console.log('data: ', data)
            }
        });
    })
}
async function getDevWallet() {
    return new Promise(async (resolve) => {
        const json = await readjson('./dev-account/privateKey.json');
        resolve(json)
    })
}
async function unCompressFile(dirName){
    spinner.start('Loading packages....')
    tarGzip.decompress({
        source: dirName,
        destination: '../../node_modules'
    }, function (error,done) {
        if(error){
           // console.log(colors.red('Something went wrong whilst setting up packages'))
            spinner.error(colors.red('Something went wrong whilst setting up packages'))
            process.exit(0)
        }
        else{
            //console.log(colors.green('Colors loaded...'))
            spinner.succeed('Packages loaded....')
        }
    });
}

module.exports = { program, arweave, saveFile, savePackageJSON, saveCache, getCache, readJSON, zipFolder, uploadToArweave, getFile, getDevWallet, ora,unCompressFile }
