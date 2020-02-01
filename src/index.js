// Discord
const Discord = require('discord.js');
const client = new Discord.Client();
const credentials = require('../data/credentials.json');
const database = require('./database');

const discordClientKey = process.env.DISCORD_CLIENT_KEY || credentials.client || null;

const cron = require('node-cron');
const commandHandler = require('./command_handlers/command_handler');

// Legiscan API
const legiscan = require('./services/legiscan');

// Utility
const { logger } = require('./logger');
const config = require('../data/config.json');

client.on('ready', () => {
  logger.success(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  const { channel } = message;

  if (channel.name && channel.name.includes('legi') && message.cleanContent.startsWith(config.commandPrefix)) {
    const command = message.cleanContent.substring(1);

    commandHandler.handle(command, message, client);
  }
});

client.login(discordClientKey);

cron.schedule('*/10 * * * *', async () => {
  const response = await legiscan.search('WA', config.query);

  if (response) {
    const bills = legiscan.getBills(response);

    if (bills.length > 0) {
      await database.load();

      for (const bill of bills) {
        database.update(bill);
      }

      const channel = client.channels.find('name', config.channel);
      await channel.send(`Updated ${bills.length} automatically.`);

      await database.save();
    }
  }
});
