const database = require('../../database.js');
const formatter = require('../../formatter.js');

exports.handle = async function (_args, message, client) {
  const { channel } = message;
  const watchlist = database.getBills();

  const bills = [];

  for (const billId in watchlist) {
    const bill = watchlist[billId];
    bills.push({ ...bill, id: billId });
  }

  await formatter.bills(bills, channel, client);
};
