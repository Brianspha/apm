const config = require('../config/config')
const arql = require('arql-ops')
const color = require('colors')
const ora = require('ora')
var fs = require('fs');
const appRoot = require('app-root-path');
var dir = `${appRoot}/apm_modules`;

async function install(packages) {
    const spinner = ora().start()
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    if (packages.length > 0) {
        var found = await Promise.resolve(getPackages(packages))
        if (found) {
            updatePackageJSON(packages)
        }
        else {
            console.error(color.red('One of the packages was not found'))
        }
    }
    else {
        console.log('in else')
        var data = await Promise.resolve(config.readJSON())
        console.log('data.dependencies ', data.dependencies)
        packages = data.dependencies
        // console.log('packages: ', packages)
        await Promise.resolve(getPackages(packages))
    }
    spinner.stop()
}

async function updatePackageJSON(packages) {
    return new Promise(async (resolve) => {
        var data = await Promise.resolve(config.readJSON())
        packages.map((package) => {
            if (!data.dependencies.includes(package)) {
                data.dependencies.push(package)
            }
        })
        resolve(true)
    })
}
async function getPackages(packages) {
    return new Promise(async (resolve) => {
        var expressions = await Promise.resolve(formulateExpressions(packages))
        console.log(expressions.expr2)
        config.arweave.arql(expressions).then((transactionIds) => {
            console.log('ids: ', transactionIds)
            if (transactionIds.length > 0) {
                var index = 2
                transactionIds.map(async (id) => {
                    //console.log('id: ', id)
                    console.log(`expr${index}`)
                    config.arweave.transactions.getData(id, { decode: true }).then(async (package) => {
                        console.log('transaction: ', t)
                        //config.fs.writeFileSync(`../../${id}`, t);
                        var pacakgeName = expressions[`expr${index}`]
                        console.log('packageName: ', pacakgeName)
                        index++
                        await Promise.resolve(config.unCompressFile(`${dir}/${pacakgeName}`, package)).then((results) => {
                            console.log('results of uncompress: ', results)
                        })
                    })
                })
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}
function formulateExpressions(packages) {
    return new Promise((resolve) => {
        packages.map((package) => {
            console.log('package: ', package)
            const query = arql.or(
                arql.equals('apm', package),
            );
            console.log(query)
            resolve(query)
        })
    })
}
const [, , ...args] = process.argv;
install(args)