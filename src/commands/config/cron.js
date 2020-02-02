const background = require('../../background');
const cron = require('node-cron');
const database = require('../../database');

exports.handle = async function(args, message, client) {
  const value = args.join(' ');

  if (value) {
    if (cron.validate(value)) {
      database.setConfig('cron', value);
      await database.save();
      background.schedule(client);
      message.reply(`Updated cron expression to ${value}.`);
    } else {
      message.reply('Please enter a cron expression with 5 valid segments.');
    }
  } else {
    message.reply(`Current cron expression is ${database.getConfig('cron')}.`);
  }
};
