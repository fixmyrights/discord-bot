const database = require('../../database');
const { logger } = require('./../../logger');

const checkValidCommand = (commandArr, validCommands) => {
  const topCmd = commandArr[0];

  if (validCommands[topCmd] === true && commandArr.length === 1) {
    return true;
  } else if (typeof validCommands[topCmd] === 'object') {
    if (commandArr.length === 1) {
      return true;
    } else {
      return checkValidCommand(commandArr.slice(1), validCommands[topCmd]);
    }
  } else {
    return false;
  }
};

exports.handle = async function(args, message, client) {
  if (args.length === 0) {
    const permissions = database.getPermission(null);
    let help = 'Current Permissions List:\n';

    for (const p of Object.keys(permissions)) {
      help += `Command: \`${p}\` Requires role: \`${permissions[p]}\`\n`;
    }

    help += 'If a command is not listed above, it is allowed by everyone.';
    message.reply(help);
  } else if (args.length === 1) {
    // const value = args[0];
    let help = 'Permission Config Examples:\n';
    help += 'Type `!config permissions config channel role-example` To require the role-example to access a particular command.\n';
    help += 'Type `!config permissions config role-example` To require the role-example to access all `config` commands.\n';
    help += 'Type `!config permissions config channel remove` to remove the role requirement from the command.\n';
    message.reply(help);
  } else {
    const roleReq = args.pop();

    const commands = database.getConfig('command-list');

    try {
      if (!checkValidCommand(args, commands)) {
        message.reply(`\`${args.join(' ➜ ')}\` is not a valid command`);
        return;
      }
      if (roleReq === 'remove') {
        message.reply(`Removed role requirement for command \`${args.join(' ➜ ')}\``);
        database.setPermission(args.join(':'), undefined);
        await database.save();
      } else {
        const role = message.guild.roles.find(x => x.name.toLowerCase() === roleReq.toLowerCase());
        if (role) {
          message.reply(`Added \`${roleReq}\` as a role requirement for the command \`${args.join(' ➜ ')}\``);
          database.setPermission(args.join(':'), roleReq);
          await database.save();
        } else {
          message.reply(`The role: \`${roleReq}\` does not exist on this server!`);
        }
      }
    } catch (e) {
      message.reply(`An error happened while updating permissions`);
      logger.error(`Error While updating permissions`, e);
    }
  }
};
