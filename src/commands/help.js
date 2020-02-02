exports.handle = async function(args, message, client) {
  await message.reply('Here is a list of commands:');
  const { channel } = message;
  await channel.send('Type `!ping`.');
  await channel.send('Type `!help` for general help.');
  await channel.send('Type `!bill help` for help regarding bills.');
  await channel.send('Type `!config help` for help regarding configuration.');
};
