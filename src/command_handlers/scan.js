const database = require('./../database');
const config = require('./../../data/config.json');
const debug = config.debug;

const parser = require('./../parser');
const credentials = require('./../../data/credentials.json');
const legiScanApiKey = process.env.LEGISCAN_API_KEY || credentials.key || null;

// Legiscan API
const legiscan = require('./../services/legiscan');

const query = '"right to repair" OR "right-to-repair" OR ((servicing OR repair) AND electronics) OR (fair AND electronic AND repair OR independent)';

exports.handle = async function (message, client) {
  const { channel } = message;

  const command = message.cleanContent.substring(1);
  const segments = command.split(' ');

  const state = await parser.state(segments.splice(1).join(' '));

  if (!state) {
    message.reply('Could not find state.');
  } else if (!legiScanApiKey && !(state in credentials.keys)) {
    message.reply(`No LegiScan API key for state code ${state}.`);
  } else {
    channel.send(`Scanning for right-to-repair legislation in ${state}...`);

    const response = await legiscan.search(state, query);
    let searchResult = '';
    let bills = [];

    // Debug
    // console.log(response.searchresult);

    if (response) {
      bills = legiscan.getBills(response);

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
