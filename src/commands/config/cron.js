const cron = require('node-cron');
const database = require('../../database.js');

exports.handle = async function(args, message, client) {
  const value = args.join(' ');

  console.log(value);

  if (value) {
    if (cron.validate(value)) {
      database.setConfig('cron', value);
      await database.save();
      message.reply('Updated cron expression.');
    } else {
      message.reply('Invalid cron expression.');
    }
  } else {
    message.reply(`Current cron expression is ${database.getConfig('cron')}`);
  }
};
