/**
 * @dev CLI Tool start
 */

/*
*@dev User input section

*/

var parser = require('./config/config').program

var results = parser.parse(process.argv);
module.exports={parser}