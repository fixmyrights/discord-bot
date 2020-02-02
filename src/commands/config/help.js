exports.handle = function(args, message, client) {
  message.reply('Here is the list of commands for config:');
  const channel = message.channel;
  channel.send('Type `!config channel [channel name]`.');
  channel.send('Type `!config cron [cron schedule]`.');
  channel.send('Type `!config state [state]`.');
  channel.send('Type `!config interval`.');
};
