const database = require('../../database');
const parser = require('../../parser');

exports.handle = async function (args, message, _client) {
  const state = parser.state(args[0]);
  const billNumber = args[1];

  if (state) {
    if (billNumber) {
      const bill = database.getBill(state, billNumber.toUpperCase());

      if (bill) {
        if (bill.watching) {
          message.reply('Bill was already being watched.');
        } else {
          bill.watching = true;
          database.setBill(bill);
          await database.save();
          message.reply('Set bill to being watched.');
        }
      } else {
        message.reply('Unknown bill.');
      }
    } else {
      message.reply('Please enter bill number for that state.');
    }
  } else {
    message.reply('Please start by entering a state by its name or two-letter code.');
  }
};
