const database = require('../../database.js');

exports.handle = async function(args, message, client) {
  const value = args[0];

  if (args.length === 0) {
    message.reply(`Current channel name is #${database.getConfig('channel')}`);
  } else if (args.length === 1) {
    database.setConfig('channel', value.startsWith('#') ? value.substring(1) : value);
    await database.save();
    message.reply('Updated channel name');
  } else {
    message.reply('Invalid channel name.');
  }
};
