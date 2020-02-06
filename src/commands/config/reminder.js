const database = require('../../database');

exports.handle = async function(args, message, _client) {
  if (args.length === 0) {
    message.reply(`Current reminder interval is ${database.getConfig('reminder')} days.`);
  } else {
    const reminder = parseInt(args[0]);
    if (reminder && reminder > 0) {
      database.setConfig('reminder', reminder);
      await database.save();
      message.reply(`Updated reminder interval to ${reminder} days.`);
    } else {
      message.reply('Please enter reminder interval as a number of days to show reminders before hearings.');
    }
  }
};
