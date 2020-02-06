const database = require('../../database');
const { logger } = require('./../../logger');
const parser = require('./../../parser');

const add = require('./add');
const help = require('./help');
const ignore = require('./ignore');
const scan = require('./scan');
const watch = require('./watch');
const watchlist = require('./watchlist');

const canDoCommand = (command, message) => {
  const roles = (database.getConfig('permissions') || {}).bill;
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
  const handler = (args.shift() || "").toLowerCase();

  if (!canDoCommand(handler, message)) {
    const notAllowedMsg = `You are not allowed to use the command \`${handler}\`.`;
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
      scan.handle(args, message, client);
      break;

    case 'list':
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
