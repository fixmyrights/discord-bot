const { logger } = require('../logger');

const ping = require('./ping');
const help = require('./help');
const bill = require('./bill/handler');
const config = require('./config/handler');

exports.handle = function(message, client) {
  const args = message.cleanContent
    .slice(1)
    .trim()
    .split(/ +/g);
  const handler = args.shift().toLowerCase();

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

    case 'help':
      help.handle(args, message, client);
      break;

    default:
      logger.debug(`Unrecognized command ${handler}.`);
      break;
  }
};
