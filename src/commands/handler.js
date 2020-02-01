const add = require('./add');
const ping = require('./ping');
const help = require('./help');
const scan = require('./scan');
const watchlist = require('./watchlist');
const bill = require('./bill/handler');
const config = require('./config/handler');

const { logger } = require('./../logger');

exports.handle = function(message, client) {
  const command = message.cleanContent
    .substring(1)
    .toLowerCase()
    .split(' ');
  const handler = command[0];
  const args = command.splice(1);

  switch (handler) {
    case 'add':
      add.handle(args, message, client);
      break;

    case 'ping':
      ping.handle(args, message, client);
      break;

    case 'help':
      help.handle(args, message, client);
      break;

    case 'scan':
    case 'query':
      scan.handle(args, message, client);
      break;

    case 'watchlist':
      watchlist.handle(args, message, client);
      break;

    case 'bill':
      bill.handle(args, message, client);
      break;

    case 'config':
      config.handle(args, message, client);
      break;

    default:
      logger.debug(message);
      logger.debug(command);
      break;
  }
};
