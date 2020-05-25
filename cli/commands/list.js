var ArgumentParser = require('argparse').ArgumentParser;
var loginCommand = new ArgumentParser({
    version: '0.0.1',
});

loginCommand.addArgument(
    ['login'],
    {
        help: `apm list`,
        nargs: '1'
    }
);
function checkValid(args) {
  //  console.log('argumens: ',args)
    var results = loginCommand.parseArgs(args)
    console.dir(results);
}
module.exports={ checkValid}