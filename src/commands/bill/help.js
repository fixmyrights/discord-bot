exports.handle = function(args, message, client) {
  message.reply('Here is the list of commands for bill:');
  const channel = message.channel;
  channel.send('Type `!bill scan [state]`.');
  channel.send('Type `!bill add [bill id]`.');
  channel.send('Type `!bill watch [state] [bill #]`.');
  channel.send('Type `!bill ignore [state] [bill #]`.');
  channel.send('Type `!bill watchlist`.');
};
