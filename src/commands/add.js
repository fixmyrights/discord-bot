const database = require('../database');
const legiscan = require('../services/legiscan');

exports.handle = async function(args, message, client) {
  const billId = args[0];

  if (billId) {
    const bill = await legiscan.getBill(billId);

    if (bill) {
      database.updateWatchlist(bill);
      await database.save();
      message.reply('Added bill.');
    } else {
      message.reply('Bill does not exist.');
    }
  } else {
    message.reply('Please enter bill id.');
  }
};
