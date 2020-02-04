const database = require('../../database');
const legiscan = require('../../services/legiscan');

exports.handle = async function(args, message, client) {
  const billId = args.join(' ');

  if (billId) {
    const bill = await legiscan.getBill(billId);

    if (bill) {
      database.updateBill(bill);
      await database.save();
      message.reply('Added bill.');
    } else {
      message.reply('Bill does not exist.');
    }
  } else {
    message.reply('Please enter a LegiScan bill id.');
  }
};
