const inquirer = require('inquirer');
const arweave = require('../config/config').arweave;
const path = require('platform-folders')
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
                'If you dont have an arweave account we will create one fo you :)',
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
                config.cache.set('wallet', address)
                printLoggedIn('Logged in succesfully you can now use the `apm publish` command to publish your package to arweave :)\n\n')
                console.log('wallet: ', address)
            })
        }
        else {
            arweave.wallets.generate().then((key) => {
                arweave.wallets.jwkToAddress(key).then((address) => {
                    getBalance(address)
                    config.cache.set('wallet', address)
                    printLoggedIn(` address: ${address} Logged in succesfully, please check the desktop folder for you wallet private key and address, you can now use the 'apm publish' command to publish your package to arweave :)\n\n`)
                    address = JSON.stringify({ "address": address })
                    key = JSON.stringify({ "privateKey": key })
                    config.saveFile('wallet', `${address}`)
                    config.saveFile('privateKey', `${key}`)
                });
            });
        }
    });
function printLoggedIn(message) {
    ui.updateBottomBar(colors.green(message))
}
module.exports = { inquirer }