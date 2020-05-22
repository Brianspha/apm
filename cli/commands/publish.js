const arweave = require('../config/config').arweave
var config = require('../config/config')
const color = require('colors')
const path = require('path');
const ora = require('ora')

async function publish() {
    var address = await Promise.resolve(config.getFile('privateKey'))
    const spinner = ora('Uploading to Arweave').start()
    console.log('wallet: ', address)
    if (address) {
        var results = await Promise.resolve(upload(address))
    }
    else {
        console.error(`Please run ${color.green('apm login')} before attempting to publish your package`)
    }
    spinner.succeed('Uploading Succesfull')
    process.exit(0)
}
async function upload(address) {
    const dirName = path.basename(path.resolve('../../' + process.cwd()));
    console.log('name: ', dirName)
    return new Promise((resolve) => {
        config.zipFolder('../', `../${dirName}.tar.gz`).then(async (results) => {
            await Promise.resolve(config.uploadToArweave(address, dirName))
            resolve(true)
            console.log('done')
        })
    })
}
publish()