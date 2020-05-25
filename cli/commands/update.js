var ArgumentParser = require('argparse').ArgumentParser;
var updateCommand = new ArgumentParser({
    version: '0.0.1',
});

updateCommand.addArgument(
    ['update'],
    {
        help: `apm update`,
        nargs: '1'
    }
);
function checkValid(args) {
   // console.log('argumens: ',args)
    var results = updateCommand.parseArgs(args)
    console.dir(args);
}
module.exports={ checkValid}