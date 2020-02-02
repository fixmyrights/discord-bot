exports.handle = async function(args, message, client) {
  await message.reply('Here is a list of bill commands:');
  const { channel } = message;
  await channel.send('Type `!bill scan [state]` to scan for new bills in a given state.');
  await channel.send('Type `!bill add [bill id]` to add an unkown bill to the watchlist.');
  await channel.send('Type `!bill watch/ignore [state] [bill #]` to add or remove a known bill from the watchlist.');
  await channel.send('Type `!bill watchlist` to see the entire watchlist.');
};
