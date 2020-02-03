const add = require('./add');
const help = require('./help');
const ignore = require('./ignore');
const scan = require('./scan');
const watch = require('./watch');
const watchlist = require('./watchlist');

exports.handle = function(args, message, client) {
  const handler = args.shift().toLowerCase();

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
