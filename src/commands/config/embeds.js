const database = require('../../database');
const formatter = require('../../formatter');
const parser = require('../../parser');

exports.handle = async function (args, message, _client) {
  const value = args[0];

  if (!value) {
    message.reply(`Currently embeds are ${formatter.toggle(database.getConfig('embeds'))}.`);
  } else {
    const setting = parser.toggle(value);
    if (setting === null) {
      message.reply('Please enter on or off to enable or disable embeds.');
    } else {
      database.setConfig('embeds', setting);
      await database.save();
      message.reply(`Updated embeds to be ${formatter.toggle(setting)}.`);
    }
  }
};
