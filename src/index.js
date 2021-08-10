require('dotenv').config();

const background = require('./background');
const Discord = require('discord.js');
const client = new Discord.Client({
  retryLimit: process.env.DISCORD_RETRY_LIMIT || 3
});
const database = require('./database');

const commandHandler = require('./commands/handler');

// Utility
const { logger } = require('./logger');

process.on('uncaughtException', err => logger.error('Uncaught exception:', err));
process.on('unhandledRejection', err => logger.error('Unhandled promise rejection:', err));
process.on('warning', logger.warn);

client.on('ready', async () => {
  await database.load();
  logger.success(`Logged in as ${client.user.tag}!`);
  background.schedule(client);
});

client.on('message', message => {
  const { channel } = message;

  const mentioned = message.content.includes(`<@!${client.user.id}>`);

  if (mentioned) {
    message.react('😇');
  }

  // Check that we are not in private messages
  if (channel.type !== 'text') return;

  if ((!database.getConfig('channel') || channel.name === database.getConfig('channel')) && message.cleanContent.startsWith(database.getConfig('prefix'))) {
    commandHandler.handle(message, client);
  }
});

client.on('error', logger.error);
client.on('DiscordAPIError', logger.error);
client.on('warn', logger.warn);
client.on('debug', logger.debug);

client.login(process.env.DISCORD_TOKEN);

module.exports = client;
