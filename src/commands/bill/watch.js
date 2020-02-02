const database = require('../../database');
const parser = require('../../parser');

exports.handle = async function(args, message, client) {
  const state = parser.state(args[0]);
  const billNumber = args[1];

  if (state) {
    if (billNumber) {
      const bill = database.getWatchlistBill(state, billNumber.toUpperCase());

      if (bill) {
        if (bill.watching) {
          message.reply('Bill was already being watched.');
        } else {
          bill.watching = true;
          database.setWatchlistBill(bill);
          await database.save();
          message.reply('Set bill to being watched.');
        }
      } else {
        message.reply('Unknown bill.');
      }
    } else {
      message.reply('Please enter bill number.');
    }
  } else {
    message.reply('Could not find state.');
  }
};
