const { logger } = require('./../../logger');

const add = require('./add');
const help = require('./help');
const ignore = require('./ignore');
const scan = require('./scan');
const watch = require('./watch');
const watchlist = require('./watchlist');

const permissions = require('./permissions.json');
const topHandler = require('./../handler');

exports.handle = function(args, message, client) {
  const handler = args[0];
  args = args.splice(1);

  if (!topHandler.canDoCommand(message, permissions[handler])) {
    const notAllowedMsg = `You are not allowed to the command \`${handler}.\``;
    message.reply(notAllowedMsg);
    logger.debug(notAllowedMsg);
    return;
  }

  switch (handler) {
    case 'add':
      add.handle(args, message, client);
      break;

    case 'help':
      help.handle(args, message, client);
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
      help.handle(args, message, client);
      break;
  }
};
