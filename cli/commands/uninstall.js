var ArgumentParser = require('argparse').ArgumentParser;
var uninstallCommand = new ArgumentParser({
    version: '0.0.1',
});

uninstallCommand.addArgument(
    ['uninstall'],
    {
        help: `apm uninstall`,
        nargs: '*'
    }
);
function checkValid(args) {
    console.log('argumens: ',args)
    var results = uninstallCommand.parseArgs(args)
    console.dir(results);
}
module.exports={ checkValid}