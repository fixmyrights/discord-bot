const ping = require('./ping');
const help = require('./help');
const bill = require('./bill/handler');
const config = require('./config/handler');

exports.handle = function(message, client) {
  const command = message.cleanContent
    .substring(1)
    .toLowerCase()
    .split(' ');
  const handler = command[0];
  const args = command.splice(1);

  switch (handler) {
    case 'ping':
      ping.handle(args, message, client);
      break;

    case 'bill':
      bill.handle(args, message, client);
      break;

    case 'config':
      config.handle(args, message, client);
      break;

    default:
      help.handle(args, message, client);
      break;
  }
};
