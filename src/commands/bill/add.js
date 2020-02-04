const database = require('../../database');
const { Legiscan } = require('../../services/legiscan.service');

exports.handle = async function(args, message, _client) {
  const billId = args[0];

  if (billId) {
    const bill = await Legiscan.getBill(billId);

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
