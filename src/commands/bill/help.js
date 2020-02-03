exports.handle = function(_args, message, _client) {
  let help = 'Here is a list of bill commands:\n';
  help += 'Type `!bill scan [state name/code]` to scan for new bills in a given state.\n';
  help += 'Type `!bill add [bill id]` to add an unkown bill to the watchlist.\n';
  help += 'Type `!bill watch/ignore [state name/code] [bill #]` to add or remove a known bill from the watchlist.\n';
  help += 'Type `!bill watchlist` to see the entire watchlist.';
  message.reply(help);
};
