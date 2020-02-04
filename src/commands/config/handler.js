const database = require('../../database');
const { logger } = require('../../logger');
const parser = require('../../parser');

const help = require('./help');
const channel = require('./channel');
const cron = require('./cron');
const embeds = require('./embeds');
const interval = require('./interval');
const permissions = require('./permissions');
const state = require('./state');

const canDoCommand = (command, message) => {
  const roles = database.getConfig('permissions').bill;
  const role = typeof roles === 'object' ? roles[command] : null;

  if (typeof roles === 'string') {
    // This particular category has a particular role
    return parser.role(roles, message);
  } else if (typeof role === 'string') {
    // This particular command has a particular role
    return parser.role(role, message);
  } else {
    // Either the role does not exist or it is specific to the next handler
    return true;
  }
};

exports.handle = function(args, message, client) {
  const handler = args[0];
  args = args.splice(1);

  if (!canDoCommand(message, `config:${handler}`)) {
    const notAllowedMsg = `You are not allowed to use the command \`${handler}.\``;
    message.reply(notAllowedMsg);
    logger.debug(notAllowedMsg);
    return;
  }

  switch (handler) {
    case 'help':
      help.handle(args, message, client);
      break;

    case 'channel':
      channel.handle(args, message, client);
      break;

    case 'permission':
    case 'permissions':
      permissions.handle(args, message, client);
      break;

    case 'cron':
      cron.handle(args, message, client);
      break;

    case 'embed':
    case 'embeds':
      embeds.handle(args, message, client);
      break;

    case 'interval':
      interval.handle(args, message, client);
      break;

    case 'state':
      state.handle(args, message, client);
      break;

    default:
      help.handle(args, message, client);
      break;
  }
};
