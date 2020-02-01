const { logger } = require('./../../logger');

exports.handle = function(args, message, client) {
  const handler = args[0];
  args = args.splice(1);

  switch (handler) {
    case 'expire':
    case 'ignore':
    case 'watch':
      message.reply("not implemented");
      break;

    default:
      logger.debug(message);
      break;
  }
};
