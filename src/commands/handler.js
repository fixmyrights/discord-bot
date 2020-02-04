const { logger } = require('../logger');

const ping = require('./ping');
const help = require('./help');
const bill = require('./bill/handler');
const config = require('./config/handler');

const permissions = require('./permissions.json');

/**
 * Checks if the message object's user has the Role necessary to perform the command
 * return true if it has permission, false otherwise.
 *
 * The user must have at least one of the string in the `permArray` as his role in order to get true
 * if the permArray is undefined or contains 0 itens it will allow the command.
 *
 * @param {object} message
 * @param {string[]} permArray
 * @returns {boolean}
 */
const canDoCommand = (message, permArray) => {
  if (permArray && Array.isArray(permArray)) {
    if (permArray.length === 0) {
      return true;
    } else {
      for (const p of permArray) {
        const f = message.member.roles.find(r => {
          logger.debug(`Comparing: ${p} vs ${r.name}`);
          return r.name.toLowerCase() === p.toLowerCase();
        });
        if (f) {
          return true;
        }
      }
    }
  } else {
    return true;
  }

  return false;
};

exports.canDoCommand = canDoCommand;

exports.handle = function(message, client) {
  const command = message.cleanContent
    .substring(1)
    .toLowerCase()
    .split(' ');
  const handler = command[0];
  const args = command.splice(1);

  if (!canDoCommand(message, permissions[handler])) {
    const notAllowedMsg = `You are not allowed to the command \`${handler}.\``;
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
