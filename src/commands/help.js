const billhelp = require('./bill/help');
const confighelp = require('./config/help');

exports.handle = function(args, message, client) {
  const arg = args.shift();
  if (arg === 'bill') {
    billhelp.handle(args, message, client);
  } else if (arg === 'config') {
    confighelp.handle(args, message, client);
  } else {
    let help = 'Here is a list of commands:\n';
    help += 'Type `!ping`.\n';
    help += 'Type `!help` for general help.\n';
    help += 'Type `!bill help` for help regarding bills.\n';
    help += 'Type `!config help` for help regarding configuration.';
    message.reply(help);
  }
};
