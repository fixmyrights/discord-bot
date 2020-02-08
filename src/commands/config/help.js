const database = require('../../database');

exports.handle = function(_args, message, _client) {
  let prefix = database.getConfig('prefix');
  if (!prefix.endsWith('!')) {
    prefix += ' ';
  }
  let help = 'Here is a list of configuration commands:\n';
  help += `Type \`${prefix}config channel [channel name]\` to switch channels.\n`;
  help += `Type \`${prefix}config cron [cron expression]\` to set the schedule of automatic queries.\n`;
  help += `Type \`${prefix}config state [state name|state code]\` to limit automatic queries to a single state.\n`;
  help += `Type \`${prefix}config interval [minutes]\` to configure time between detailed queries.\n`;
  help += `Type \`${prefix}config embeds [on|off]\` to choose whether to show rich embeds.\n`;
  help += `Type \`${prefix}config permissions [command] [(optional) subcommand] [rolename]\` to add role requirement to a command.\n`;
  help += `Type \`${prefix}config permissions [command] [(optional) subcommand] remove\` to remove the role requirement to a command.\n`;
  help += `Type \`${prefix}config prefix [prefix]\` to change the command prefix.`;
  message.reply(help);
};
