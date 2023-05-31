
/*
 * entry point for command
 * and each command in own file add on our commands object
 */

// Array object of all commands. Each command have his own object
var myCommands = {};
// module.exports = {myCommands};
exports.myCommands = myCommands;

exports.add = function (commandName, helptext, description, callback) {


      // check if the command already exist
      if (myCommands.hasOwnProperty(commandName)) {
            console.error(`Command ${commandName} already exists`);
            return;
      }
      // add the command :
      myCommands[commandName.toUpperCase()] = {
            helptext: helptext,
            description: description,
            callback: callback
      };

};


exports.remove = function (command) {
      delete myCommands[command];
};


exports.exists = function (command) {
      return typeof (myCommands[command.toUpperCase()]) !== 'undefined';
};


exports.help = function (command) {
      return myCommands[command.toUpperCase()].helpText;
};

