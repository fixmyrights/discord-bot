const database = require('../../database');

exports.handle = function (_args, message, _client) {
  let prefix = database.getConfig('prefix');
  if (!prefix.endsWith('!')) {
    prefix += ' ';
  }

  let help = 'Here is a list of bill commands:\n';
  help += `Type \`${prefix}bill scan [state name/code]\` to scan for new bills in a given state.\n`;
  help += `Type \`${prefix}bill add [bill id]\` to add an unkown bill to the watchlist.\n`;
  help += `Type \`${prefix}bill ignore [state name|state code] [bill #]\` to remove a known bill from the watchlist.\n`;
  help += `Type \`${prefix}bill watch [state name|state code] [bill #]\` to add a known bill to the watchlist.\n`;
  help += `Type \`${prefix}bill list\` to see the entire watchlist.`;
  message.reply(help);
};
