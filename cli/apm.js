/**
 * @dev CLI Tool start
 */

/*
*@dev User input section

*/
const [, , ...args] = process.argv;


var parser = require('./config/config').program

var results = parser.parse(process.argv);
/**console.log(parser.parse(args))
import commands

switch (args[0].toLowerCase()) {
    case "help":
        help.checkValid(args)
        break
    case "init":
        init.checkValid(args)
        break
    case "login":
        login.checkValid(args)
        break
    case "view":
        view.checkValid(args)
        break
    case "update":
        update.checkValid(args)
        break
    case "uninstall":
        uninstall.checkValid(args)
        break
    case "rebuild":
        rebuild.checkValid(args)
        break
    case "install":
        install.checkValid(args)
        break
    case "init":
        init.checkValid(args)
        break
}*/
module.exports={parser}