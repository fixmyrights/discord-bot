const billhelp = require('./bill/help');
const confighelp = require('./config/help');

exports.handle = function(args, message, _client) {
  if (args[0] === 'bill') {
    billhelp.handle(null, message, _client);
  } else if (args[0] === 'config') {
    confighelp.handle(null, message, _client);
  } else {
    let help = 'Here is a list of commands:\n';
    help += 'Type `!ping`.\n';
    help += 'Type `!help` for general help.\n';
    help += 'Type `!bill help` for help regarding bills.\n';
    help += 'Type `!config help` for help regarding configuration.';
    message.reply(help);
  }
};
