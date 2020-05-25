var ArgumentParser = require('argparse').ArgumentParser;
var helpCommand = new ArgumentParser({
    version: '0.0.1',
});

helpCommand.addArgument(
    ['rebuild'],
    {
        help: `apm rebuild`,
        nargs: '1'
    }
);
function checkValid(args) {
   // console.log('argumens: ',args)
    var results = helpCommand.parseArgs(args)
    console.dir(args);
}
module.exports={ checkValid}