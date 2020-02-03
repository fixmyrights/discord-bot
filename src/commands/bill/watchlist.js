const database = require('../../database.js');
const formatter = require('../../formatter.js');

exports.handle = async function(args, message, client) {
  const { channel } = message;
  const watchlist = database.getBills();

  let count = 0;
  let result = '';
  const watchedBills = [];

  for (const billId in watchlist) {
    const bill = watchlist[billId];

    if (bill.watching) {
      count += 1;
      watchedBills.push(bill);
    }
  }

  await formatter.backgroundBills(watchedBills, channel);

  result += `${count} bills in watchlist.`;

  await channel.send(result);
};
