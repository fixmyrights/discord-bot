const { logger } = require('./../../logger');
const add = require('./add');
const ignore = require('./ignore');
const scan = require('./scan');
const watch = require('./watch');
const watchlist = require('./watchlist');

exports.handle = function(args, message, client) {
  const handler = args[0];
  args = args.splice(1);

  switch (handler) {
    case 'add':
      add.handle(args, message, client);
      break;

    case 'ignore':
      ignore.handle(args, message, client);
      break;

    case 'scan':
    case 'query':
      scan.handle(args, message, client);
      break;

    case 'list':
    case 'watchlist':
      watchlist.handle(args, message, client);
      break;

    case 'watch':
      watch.handle(args, message, client);
      break;

    default:
      logger.debug(message);
      break;
  }
};
