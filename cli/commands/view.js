var ArgumentParser = require('argparse').ArgumentParser;
var viewCommand = new ArgumentParser({
    version: '0.0.1',
});

viewCommand.addArgument(
    ['view'],
    {
        help: `apm view`,
        nargs: '1'
    }
);
function checkValid(args) {
    console.log('argumens: ',args)
    var results = viewCommand.parseArgs(args)
    console.dir(results);
}
module.exports={ checkValid}