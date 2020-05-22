const arweave = require('../config/config').arweave
var config = require('../config/config')
const color = require('colors')
const path = require('path');
const ora = require('ora')
const fs = require("fs")
const inquirer = require('inquirer')
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))
async function publish() {
    inquirer.prompt([
        {
            type: 'fuzzypath',
            name: 'path',
            excludePath: nodePath => nodePath.startsWith('node_modules'),
            // excludePath :: (String) -> Bool
            // excludePath to exclude some paths from the file-system scan
            excludeFilter: nodePath => nodePath == '.',
            // excludeFilter :: (String) -> Bool
            // excludeFilter to exclude some paths from the final list, e.g. '.'
            itemType: 'any',
            // itemType :: 'any' | 'directory' | 'file'
            // specify the type of nodes to display
            // default value: 'any'
            // example: itemType: 'file' - hides directories from the item list
            rootPath: '../',
            // rootPath :: String
            // Root search directory
            message: 'Select the directory of the package you want to publish by searching for it:',
            default: '/apm',
            suggestOnly: false,
            // suggestOnly :: Bool
            // Restrict prompt answer to available choices or use them as suggestions
            depthLimit: 20,
            // depthLimit :: integer >= 0
            // Limit the depth of sub-folders to scan
            // Defaults to infinite depth if undefined
        }
    ]).then(async (dir) => {
        console.log('dir: ', dir)
        var address = await Promise.resolve(config.getFile('privateKey'))
        const spinner = ora('Uploading to Arweave').start()
        console.log('wallet: ', address)
        if (address) {
            var results = await Promise.resolve(upload(address, dir))
        }
        else {
            console.error(`Please run ${color.green('apm login')} before attempting to publish your package`)
        }
        spinner.succeed('Uploading Succesfull')
        process.exit(0)
    })

}
async function upload(address, packageDir) {
    const dirName = path.basename(path.resolve('../../' + process.cwd()));
    console.log('name: ', dirName, 'packageDir: ', packageDir.path)
    return new Promise((resolve) => {
        config.zipFolder(packageDir.path, `../${dirName}.tar.gz`).then(async (results) => {
            await Promise.resolve(config.uploadToArweave(address, dirName))
            resolve(true)
            console.log('done')
        })
    })
}
publish()