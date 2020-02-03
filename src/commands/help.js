exports.handle = async function(_args, message, _client) {
  let help = 'Here is a list of commands:\n';
  help += 'Type `!ping`.\n';
  help += 'Type `!help` for general help.\n';
  help += 'Type `!bill help` for help regarding bills.\n';
  help += 'Type `!config help` for help regarding configuration.';
  await message.reply(help);
};
