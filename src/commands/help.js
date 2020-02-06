const billhelp = require('./bill/help');
const confighelp = require('./config/help');

exports.handle = function(_args, message, _client) {
  if (_args == 'bill') {
    billhelp.handle(null, message, _client);
  }
  else if (_args == 'config') {
    confighelp.handle(null, message, _client);
  }
  else {
    let help = 'Here is a list of commands:\n';
    help += 'Type `!ping`.\n';
    help += 'Type `!help` for general help.\n';
    help += 'Type `!bill help` for help regarding bills.\n';
    help += 'Type `!config help` for help regarding configuration.';
    message.reply(help);
  }
};
