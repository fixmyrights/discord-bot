const { logger } = require('./../../logger');

const cron = require('./cron');

exports.handle = function(args, message, client) {
  const handler = args[0];
  args = args.splice(1);

  switch (handler) {
    case 'cron':
      cron.handle(args, message, client);
      break;

    case 'limit':
    case 'channel':
      message.reply('not implemented');
      break;

    default:
      logger.debug(message);
      break;
  }
};
