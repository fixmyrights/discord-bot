const database = require('../../database.js');

exports.handle = async function(args, message, client) {
  const value = args[0];

  if (args.length === 0) {
    message.reply(`Current channel name is #${database.getConfig('channel')}`);
  } else if (args.length === 1) {
    const name = value.startsWith('#') ? value.substring(1) : value;
    const channel = client.channels.find('name', name);
    if (channel) {
      database.setConfig('channel', name);
      await database.save();
      message.reply('Updated channel name');
    } else {
      message.reply('Channel does not exist.');
    }
  } else {
    message.reply('Invalid channel name.');
  }
};
