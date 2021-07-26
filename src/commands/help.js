const billhelp = require('./bill/help');
const confighelp = require('./config/help');
const database = require('../database');

exports.handle = function (args, message, client) {
  const arg = args.shift();
  if (arg === 'bill') {
    billhelp.handle(args, message, client);
  } else if (arg === 'config') {
    confighelp.handle(args, message, client);
  } else {
    let prefix = database.getConfig('prefix');
    if (!prefix.endsWith('!')) {
      prefix += ' ';
    }
    let help = 'Here is a list of commands:\n';
    help += `Type \`${prefix}ping\`.\n`;
    help += `Type \`${prefix}help\` for general help.\n`;
    help += `Type \`${prefix}bill help\` for help regarding bills.\n`;
    help += `Type \`${prefix}config help\` for help regarding configuration.`;
    message.reply(help);
  }
};
