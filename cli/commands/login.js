const inquirer = require('inquirer');
const arweave = require('../config/config').arweave;
const config = require('../config/config')
var ui = new inquirer.ui.BottomBar();
var colors = require('colors');
inquirer
    .prompt([
        {
            type: 'list',
            name: 'wallet',
            message: 'Dont have an Arweave account',
            choices: [
                'Yes',
                'No',
                new inquirer.Separator(),
                'If you dont have an arweave account we will create one for you :)',
                {
                    name: 'Read more here',
                    disabled: 'https://www.arweave.org/wallet'
                }
            ]
        }
    ])
    .then(answers => {
        console.log('ans: ', answers)
        if (answers.wallet === "Yes") {
            inquirer.prompt([{
                type: 'input',
                name: 'wallet_addess',
                message: "Please enter your wallet address",
                validate: function (value) {
                    if (value && value.length === 43) {
                        return true
                    }
                    else {
                        return 'Please enter a valid arweave address'
                    }
                }
            }]).then((address) => {
                config.saveCache(['wallet', address])
                printLoggedIn('Logged in succesfully you can now use the `apm publish` command to publish your package to arweave :)\n\n')
                console.log('wallet: ', address)
            })
        }
        else {
            arweave.wallets.generate().then((key) => {
                arweave.wallets.jwkToAddress(key).then(async(address) => {
                   var spinner= config.ora()
                   spinner.start('Creating a new wallet')
                    await Promise.resolve(sendAR(address))
                    config.saveCache(['wallet', address])
                    printLoggedIn(` address: ${colors.yellow(address)} Logged in succesfully, please check the desktop folder for you wallet private key and address, you can now use the 'apm publish' command to publish your package to arweave :)\n\n`)
                    address = JSON.stringify({ "address": address })
                    key = JSON.stringify({ "privateKey": key })
                    config.saveFile('wallet', `${address}`)
                    config.saveFile('privateKey', `${key}`)
                    spinner.stop()
                });
            });
        }
    });
async function sendAR(address) {
    return new Promise(async (resolve) => {
        var dev = await Promise.resolve(config.getDevWallet())
        let transaction = arweave.createTransaction({
            target: address,
            quantity: arweave.ar.arToWinston('0.03')
        }, dev.privateKey);
        resolve(true)
    })
}
function printLoggedIn(message) {
    ui.updateBottomBar(colors.green(message))
}
module.exports = { inquirer }