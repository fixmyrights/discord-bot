const database = require('../../database');
const formatter = require('../../formatter');
const parser = require('../../parser');
const credentials = require('../../../data/credentials.json');
const legiScanApiKey = process.env.LEGISCAN_API_KEY || credentials.key || null;

// Legiscan API
const legiscan = require('../../services/legiscan');

exports.handle = async function(args, message, client) {
  const { channel } = message;

  const state = await parser.state(args.join(' '));

  if (!state) {
    message.reply('Please enter a state by its name or two-letter code.');
  } else if (!legiScanApiKey && !(state in credentials.keys)) {
    message.reply(`No LegiScan API key for state code ${state}.`);
  } else {
    channel.send(`Scanning for right-to-repair legislation in ${state}...`);

    const bills = await legiscan.search(state, database.getConfig('query'));
    let searchResult = '';

    if (bills) {
      if (bills.length > 0) {
        await database.load();
        for (const bill of bills) {
          database.updateBill(bill);
          if (searchResult.length > 500) {
            // Discord only supports 2000 max, so split into multiple messages
            await channel.send(searchResult);
            searchResult = '';
          }
          searchResult += formatter.bill(bill);
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
};
