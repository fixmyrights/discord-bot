const ping = require('./ping');
const help = require('./help');
const scan = require('./scan');

const { logger } = require('./../logger');

exports.handle = function (command, message, client) {

  const cmd = command.toLowerCase().split(' ')[0];
  switch(cmd) {
    case 'ping':
      ping.handle(message, client);
      break;

    case 'help':
      help.handle(message, client);
      break;

    case 'scan':
    case 'query':
      scan.handle(message, client);
      break;

    default:
      logger.debug(message);
      logger.debug(cmd);
      break;
  }

};
