const { program } = require('commander');
const createFile = require('create-file');
program
    .version('0.0.1')
    .command('install [name]', 'install one or more packages', { executableFile: '../cli/commands/install' })
    .alias('i')
    .option('-f, --force', 'force')
    .command('help', 'outputs all commands', { executableFile: '../cli/commands/help' }, { isDefault: true })
    .alias('h')
    .usage(' help')
    .command('list', 'list packages installed', { executableFile: '../cli/commands/list' })
    .alias('ls')
    .usage(' list')
    .command('publish', 'publish the package to arweave', { executableFile: '../cli/commands/publish' })
    .alias('p')
    .usage(' publish')
    .command('login', 'login with your arweave wallet', { executableFile: '../cli/commands/login' })
    .alias('l')
    .usage(' login')
    .command('view', 'view all packages with their authors', { executableFile: '../cli/commands/view' })
    .alias('v')
    .usage(' view')
    .command('uninstall [name]', 'uninstall a package or packages', { executableFile: '../cli/commands/uninstall' })
    .usage(' uninstall [name] [--force,-force, force]')
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
const Arweave = require('arweave/node');

const arweave = Arweave.init({
    host: 'arweave.net',// Hostname or IP address for a Arweave host
    port: 443,          // Port
    protocol: 'https',  // Network protocol http or https
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
});
function saveFile(fileName, contents) {
    createFile(`${path.getDesktopFolder()}/arweave/${fileName}.json`, `${contents}`, (error) => {
        if (error) {
            console.error('error: ', error)
        }
    })
}
function savePackageJSON(contents) {
    createFile(`../testPackage.json`, `${contents}`, (error) => {
        if (error) {
            console.error('error: ', error)
        }
    })
}
const NodeCache = require( "node-cache" );
const cache = new NodeCache({ stdTTL: 1000, checkperiod: 1000 });
module.exports = { program, arweave,saveFile,savePackageJSON,cache }
