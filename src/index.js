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
  logger.success(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  const { channel } = message;

  if (channel.name && channel.name.includes('legi') && message.cleanContent.startsWith(database.getConfig('commandPrefix'))) {
    commandHandler.handle(message, client);
  }
});

client.login(discordClientKey);

cron.schedule(database.getConfig('cron'), async () => {
  const response = await legiscan.search('WA', database.getConfig('query'));

  if (response) {
    const bills = legiscan.getBills(response);

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
