const { logger } = require('./../../logger');

const help = require('./help');
const channel = require('./channel');
const cron = require('./cron');
const embeds = require('./embeds');
const interval = require('./interval');
const state = require('./state');
const permission = require('./permission');
const topHandler = require('./../handler');

exports.handle = function(args, message, client) {
  const handler = args[0];
  args = args.splice(1);

  if (!topHandler.canDoCommand(message, `config:${handler}`)) {
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
      permission.handle(args, message, client);
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
