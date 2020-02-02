exports.handle = async function(args, message, client) {
  let help = 'Here is a list of configuration commands:\n';
  help += 'Type `!config channel [channel name]` to switch channels.\n';
  help += 'Type `!config cron [cron expression]` to set the schedule of automatic queries.\n';
  help += 'Type `!config state [state name/code]` to limit automatic queries to a single state.\n';
  help += 'Type `!config interval [minutes]` to configure time between detailed queries.';
  await message.reply(help);
};
