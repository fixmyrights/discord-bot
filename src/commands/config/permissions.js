const commands = require('../../../data/commands.json');
const database = require('../../database');

exports.handle = async function(args, message, client) {
  let command, help, group, role, roleArg;
  let permissions = database.getConfig('permissions');

  switch (args.length) {
    case 0:
      help = `Current permissions are ${JSON.stringify(permissions, null, 2)}.`;
      message.reply(help);
      break;

    case 3:
      group = args[0];

      if (!commands[group]) {
        message.reply(`${group} is not a valid command group.`);
        break;
      }
    // Fallthrough
    case 2:
      roleArg = args.pop();

      // Command may also be a group, in which case it will set an entire group of commands to the role
      command = args.pop();

      if (group ? !commands[group][command] : !commands[command]) {
        message.reply(`\`${command}\` is not a valid command.`);
        break;
      }

      role = roleArg === 'remove' ? undefined : message.guild.roles.find(x => [x.id, x.name.toLowerCase()].includes(roleArg.toLowerCase())) ? roleArg : null;

      if (role === null) {
        message.reply(`The role: \`${roleArg}\` does not exist on this server.`);
      } else {
        if (typeof permissions !== 'object') {
          const existingRole = permissions;
          permissions = {};
          for (const command in commands) {
            permissions[command] = existingRole;
          }
        }

        if (group) {
          if (typeof permissions[group] !== 'object') {
            const existingRole = permissions[group];
            permissions[group] = {};
            for (const groupCommand in commands[group]) {
              permissions[group][groupCommand] = existingRole;
            }
          }
          permissions[group][command] = role;
          if (Object.keys(permissions[group]).length === 1 && role === undefined) {
            permissions[group] = undefined;
          }
        } else {
          permissions[command] = role;
          if (Object.keys(permissions).length === 1 && role === undefined) {
            permissions = undefined;
          }
        }
        database.setConfig('permissions', permissions);
        database.save();
        message.reply('Updated permissions.');
      }
      break;

    case 1:
      if (args[0] === 'remove') {
        permissions = undefined;
        database.setConfig('permissions', permissions);
        database.save();
        message.reply('Removed all permissions.');
        break;
      }
    // Fallthrough
    default:
      help = 'Permission Config Examples:\n';
      help += 'Type `!config permissions config channel role-example` To require the role-example to access a particular command.\n';
      help += 'Type `!config permissions config role-example` To require the role-example to access all `config` commands.\n';
      help += 'Type `!config permissions config channel remove` to remove the role requirement from the command.\n';
      message.reply(help);
      break;
  }
};
