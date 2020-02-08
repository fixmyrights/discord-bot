const database = require('../../database');
const formatter = require('../../formatter');
const parser = require('../../parser');

exports.handle = async function(args, message, _client) {
  const value = args[0];

  if (!value) {
    message.reply(`Currently heartbeat is ${formatter.toggle(database.getConfig('heartbeat'))}.`);
  } else {
    const setting = parser.toggle(value);
    if (setting === null) {
      message.reply('Please enter on or off to enable or disable heartbeat.');
    } else {
      database.setConfig('heartbeat', setting);
      await database.save();
      message.reply(`Updated heartbeat to be ${formatter.toggle(setting)}.`);
    }
  }
};
