const { logger } = require('./../../logger');

const ignore = require('./ignore');

exports.handle = function(args, message, client) {
  const handler = args[0];
  args = args.splice(1);

  switch (handler) {
    case 'ignore':
      ignore.handle(args, message, client);
      break;

    case 'watch':
      message.reply('not implemented');
      break;

    default:
      logger.debug(message);
      break;
  }
};
