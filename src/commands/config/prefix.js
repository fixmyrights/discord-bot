const database = require('../../database');

exports.handle = async function(args, message, client) {
  const value = args[0];

  if (args.length === 0) {
    message.reply(`Current prefix is ${database.getConfig('prefix')}.`);
  } else if (args.length === 1) {
    database.setConfig('prefix', value);
    await database.save();
    message.reply(`Updated prefix to ${value}.`);
  } else {
    message.reply('Invalid prefix.');
  }
};
