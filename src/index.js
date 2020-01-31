// Discord
const Discord = require('discord.js');
const client = new Discord.Client();
const credentials = require('../data/credentials.json');

const discordClientKey = process.env.DISCORD_CLIENT_KEY || credentials.client || null;
const database = require('./database');

const cron = require('node-cron');

// Legiscan API
const api = require('./api');
const legiScanApiKey = process.env.LEGISCAN_API_KEY || credentials.key || null;

// Utility
const parser = require('./parser');
const config = require('../data/config.json');
const debug = false;

const query = '"right to repair" OR "right-to-repair" OR ((servicing OR repair) AND electronics) OR (fair AND electronic AND repair OR independent)';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const getBills = response => {
  const bills = [];
  for (const billIndex in response.searchresult) {
    const bill = response.searchresult[billIndex];
    if (!bill.text_url) {
      continue;
    }
    const title = parser.title(bill);
    if (parser.titleRelevance(title)) {
      debug && console.log(`Found bill "${title}"`);
      bills.push(bill);
    } else {
      debug && console.log(`Ignored bill "${title}"`);
    }
  }

  // Most recently updated at the top
  sortBills(bills);

  return bills;
};

const sortBills = bills => bills.sort((a, b) => new Date(b.last_action_date) - new Date(a.last_action_date));

client.on('message', async message => {
  const { channel } = message;

  if (channel.name && channel.name.includes('legi') && message.cleanContent.startsWith('!')) {
    const command = message.cleanContent.substring(1);
    const segments = command.split(' ');

    if (command === 'ping') {
      message.reply('pong');
    } else if (command === 'help') {
      message.reply('Type `!query [state name or 2 letter code]`');
    } else if (command.startsWith('query ') || command.startsWith('scan ')) {
      const state = await parser.state(segments.splice(1).join(' '));

      if (!state) {
        message.reply('Could not find state.');
      } else if (!legiScanApiKey && !(state in credentials.keys)) {
        message.reply(`No LegiScan API key for state code ${state}.`);
      } else {
        channel.send(`Scanning for right-to-repair legislation in ${state}...`);

        const response = await api.search(state, query);
        let searchResult = '';
        let bills = [];

        // Debug
        // console.log(response.searchresult);

        if (response) {
          bills = getBills(response);

          if (bills.length > 0) {
            await database.load();
            for (const bill of bills) {
              database.update(bill);
              if (searchResult.length > 500) {
                // Discord only supports 2000 max, so split into multiple messages
                await channel.send(searchResult);
                searchResult = '';
              }
              searchResult += `**${bill.bill_number}**: *${parser.title(bill)}* ${bill.last_action.toUpperCase()} as of \`${bill.last_action_date}\` (<${bill.text_url}>)\n`;
            }

            await database.save();
          } else {
            searchResult += 'No current legislation found.';
          }
          await channel.send(searchResult);
        } else {
          message.reply('LegiScan API error.');
        }
      }
    }
  }
});

client.login(discordClientKey);

cron.schedule('*/10 * * * *', async () => {
  const response = await api.search('WA', query);

  if (response) {
    const bills = getBills(response);

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
