const database = require('../../database');

exports.handle = async function(args, message, client) {
  const value = args[0];

  if (!value) {
    message.reply(`Currently embeds are ${database.getConfig('embeds') ? 'on' : 'off'}.`);
  } else {
    let setting = null;
    if (value === 'on') {
      setting = true;
    } else {
      setting = false;
    }
    if (setting !== null) {
      database.setConfig('embeds', setting);
      await database.save();
      message.reply(`Updated embeds to be ${setting ? 'on' : 'off'}.`);
    } else {
      message.reply('Please enter on or off to enable or disable embeds.');
    }
  }
};
