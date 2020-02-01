const database = require('../../database.js');
const parser = require('../../parser.js');

exports.handle = async function(args, message, client) {
  const state = parser.state(args[0]);
  const billNumber = args[1];

  if (state) {
    if (billNumber) {
      const bill = database.getWatchlistBill(state, billNumber.toUpperCase());

      if (bill) {
        bill.status = 'ignored';
        database.setWatchlistBill(bill);
        await database.save();
        message.reply('Set bill to ignored.');
      } else {
        message.reply('Bill does not exist.');
      }
    } else {
      message.reply('Please enter bill number.');
    }
  } else {
    message.reply('Could not find state.');
  }
};
