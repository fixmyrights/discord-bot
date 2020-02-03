const background = require('./background');
const Discord = require('discord.js');
const client = new Discord.Client();
const credentials = require('../data/credentials.json');
const database = require('./database');

const discordClientKey = process.env.DISCORD_CLIENT_KEY || credentials.client || null;

const commandHandler = require('./commands/handler');

// Utility
const { logger } = require('./logger');

client.on('ready', async () => {
  await database.load();
  logger.success(`Logged in as ${client.user.tag}!`);
  background.schedule(client);
});

client.on('message', async message => {
  const { channel } = message;

  const mentioned = message.content.includes(`<@!${client.user.id}>`);

  if (mentioned) {
    message.react('😇');
  }

  // Check that we are not in private messages
  if (!channel) return;

  if (channel.name === database.getConfig('channel') && message.cleanContent.startsWith(database.getConfig('prefix'))) {
    commandHandler.handle(message, client);
  }
});

client.login(discordClientKey);
