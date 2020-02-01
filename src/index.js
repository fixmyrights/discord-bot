// Discord
const Discord = require('discord.js');
const client = new Discord.Client();
const credentials = require('../data/credentials.json');
const database = require('./database');

const discordClientKey = process.env.DISCORD_CLIENT_KEY || credentials.client || null;

const cron = require('node-cron');
const commandHandler = require('./commands/handler');

// Legiscan API
const legiscan = require('./services/legiscan');

// Utility
const { logger } = require('./logger');

client.on('ready', () => {
  database.load();
  logger.success(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  const { channel } = message;

  if (channel.name && channel.name === database.getConfig('channel') && message.cleanContent.startsWith(database.getConfig('prefix'))) {
    commandHandler.handle(message, client);
  }
});

client.login(discordClientKey);

cron.schedule(database.getConfig('cron'), async () => {
  const bills = await legiscan.search('WA', database.getConfig('query'));

  if (bills) {
    if (bills.length > 0) {
      await database.load();

      for (const bill of bills) {
        database.updateWatchlist(bill);
      }

      const channel = client.channels.find('name', database.getConfig('channel'));
      await channel.send(`Updated ${bills.length} automatically.`);

      await database.save();
    }
  }
});
