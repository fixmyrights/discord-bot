const channel = require('./channel');
const cron = require('./cron');

exports.handle = function(args, message, client) {
  const handler = args[0];
  args = args.splice(1);

  switch (handler) {
    case 'channel':
      channel.handle(args, message, client);
      break;

    case 'cron':
      cron.handle(args, message, client);
      break;

    default:
      message.reply('Setting not found.');
      break;
  }
};
