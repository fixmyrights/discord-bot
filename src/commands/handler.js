const { logger } = require('../logger');

const ping = require('./ping');
const help = require('./help');
const bill = require('./bill/handler');
const config = require('./config/handler');

const database = require('./../database');

/**
 * Checks if the message object's user has the Role necessary to perform the command
 * return true if it has permission, false otherwise.
 *
 * The user must have at least one of the string in the `requiredRole` as his role in order to get true
 * if the requiredRole is undefined or contains 0 itens it will allow the command.
 *
 * @param {object} message
 * @param {string} desiredCommand
 * @returns {boolean}
 */
const canDoCommand = (message, desiredCommand) => {
  const requiredRole = database.getPermission(desiredCommand);

  if (requiredRole) {
    const f = message.member.roles.find(r => r.name.toLowerCase() === requiredRole.toLowerCase());
    if (f) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

exports.canDoCommand = canDoCommand;

exports.handle = function(message, client) {
  const command = message.cleanContent
    .substring(1)
    .toLowerCase()
    .split(' ');
  const handler = command[0];
  const args = command.splice(1);

  if (!canDoCommand(message, handler)) {
    const notAllowedMsg = `You are not allowed to use the command \`${handler}.\``;
    message.reply(notAllowedMsg);
    logger.debug(notAllowedMsg);
    return;
  }

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
