exports.handle = async function(args, message, client) {
  await message.reply('Here is a list of configuration commands:');
  const { channel } = message;
  await channel.send('Type `!config channel [channel name]` to switch channels.');
  await channel.send('Type `!config cron [cron expression]` to set the schedule of automatic queries.');
  await channel.send('Type `!config state [state name/code]` to limit automatic queries to a single state.');
  await channel.send('Type `!config interval [minutes]` to configure time between detailed queries.');
};
