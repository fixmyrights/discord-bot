const database = require('../database.js');
const formatter = require('../formatter.js');

exports.handle = async function(args, message, client) {
  const { channel } = message;
  const watchlist = database.getWatchlist();

  let count = 0;
  let result = '';

  for (const billId in watchlist) {
    const bill = watchlist[billId];

    if (bill.watching) {
      count += 1;
      if (result.length > 500) {
        // Discord only supports 2000 max, so split into multiple messages
        await channel.send(result);
        result = '';
      }
      result += formatter.bill(bill);
    }
  }

  result += `${count} bills in watchlist.`;

  await channel.send(result);
};
