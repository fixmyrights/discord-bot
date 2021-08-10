const { logger } = require('../logger');

const ping = require('./ping');
const help = require('./help');
const bill = require('./bill/handler');
const config = require('./config/handler');

const database = require('./../database');
const parser = require('./../parser');

/**
 * Checks if the message object's user has the Role necessary to perform the command
 * return true if it has permission, false otherwise.
 *
 * The user must have at least one of the string in the `requiredRole` as his role in order to get true
 * if the requiredRole is undefined or contains 0 itens it will allow the command.
 *
 * @param {string} command
 * @param {object} message
 * @returns {boolean}
 */
const canDoCommand = (command, message) => {
  const roles = database.getConfig('permissions') || {};
  const role = typeof roles === 'object' ? roles[command] : null;

  if (typeof roles === 'string') {
    // The entire category has a single role
    return parser.role(roles, message);
  } else if (typeof role === 'string') {
    // This particular command has a particular role
    return parser.role(role, message);
  } else {
    // Either the role does not exist or it is specific to the next handler
    return true;
  }
};

exports.handle = function (message, client) {
  const args = message.cleanContent.slice(database.getConfig('prefix').length).trim().split(/ +/g);
  const handler = args.shift().toLowerCase();

  if (!canDoCommand(handler, message)) {
    const notAllowedMsg = `You are not allowed to use the command \`${handler}\`.`;
    message.reply(notAllowedMsg);
    logger.debug(notAllowedMsg);
    return;
  }

  try {
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
  } catch (err) {
    logger.error(`Command "${handler}" failed:`, err);
  }
};
