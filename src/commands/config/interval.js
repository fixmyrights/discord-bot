const database = require('../../database');

exports.handle = async function (args, message, _client) {
  if (args.length === 0) {
    message.reply(`Current interval is ${database.getConfig('interval')} minutes.`);
  } else {
    const interval = parseInt(args[0]);
    if (interval && interval > 0) {
      database.setConfig('interval', interval);
      await database.save();
      message.reply(`Updated interval to ${interval} minutes.`);
    } else {
      message.reply('Please enter interval as a number of minutes before querying bills in detail.');
    }
  }
};
