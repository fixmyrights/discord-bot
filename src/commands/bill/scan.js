const database = require('../../database');
const formatter = require('../../formatter');
const parser = require('../../parser');

// Legiscan API
const legiscan = require('../../services/legiscan');

exports.handle = async function (args, message, client) {
  const { channel } = message;

  const state = parser.state(args.join(' '));

  if (!state) {
    message.reply('Please enter a state by its name or two-letter code.');
  } else {
    channel.send(`Scanning for right-to-repair legislation in ${state}...`);

    const bills = await legiscan.search(state, database.getConfig('query'));

    if (bills) {
      if (bills.length > 0) {
        await database.load();
        for (const bill of bills) {
          database.updateBill(bill);
        }
        await formatter.bills(bills, channel, client);
        await database.save();
      } else {
        channel.send('No current legislation found.');
      }
    } else {
      message.reply('LegiScan API error.');
    }
  }
};
