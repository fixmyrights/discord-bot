const database = require('../../database.js');
const parser = require('../../parser.js');

exports.handle = async function(args, message, client) {
  if (args.length === 0) {
    message.reply(`Current state is ${database.getConfig('state')}`);
  } else {
    const state = parser.state(args.join(' '));
    if (state) {
      database.setConfig('state', state);
      await database.save();
      message.reply('Updated state');
    } else {
      message.reply('Could not find state.');
    }
  }
};
