const database = require('../../database');
const { logger } = require('../../logger');
const parser = require('../../parser');

const channel = require('./channel');
const cron = require('./cron');
const embeds = require('./embeds');
const heartbeat = require('./heartbeat');
const help = require('./help');
const interval = require('./interval');
const permissions = require('./permissions');
const prefix = require('./prefix');
const reminder = require('./reminder');
const state = require('./state');

const canDoCommand = (command, message) => {
  const roles = (database.getConfig('permissions') || {}).config;
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

exports.handle = function (args, message, client) {
  const handler = (args.shift() || '').toLowerCase();

  if (!canDoCommand(handler, message)) {
    const notAllowedMsg = `You are not allowed to use the command \`${handler}\`.`;
    message.reply(notAllowedMsg);
    logger.debug(notAllowedMsg);
    return;
  }

  switch (handler) {
    case 'channel':
      channel.handle(args, message, client);
      break;

    case 'permissions':
      permissions.handle(args, message, client);
      break;

    case 'prefix':
      prefix.handle(args, message, client);
      break;

    case 'cron':
      cron.handle(args, message, client);
      break;

    case 'embeds':
      embeds.handle(args, message, client);
      break;

    case 'heartbeat':
      heartbeat.handle(args, message, client);
      break;

    case 'interval':
      interval.handle(args, message, client);
      break;

    case 'reminder':
      reminder.handle(args, message, client);
      break;

    case 'state':
      state.handle(args, message, client);
      break;

    default:
      help.handle(args, message, client);
      break;
  }
};
