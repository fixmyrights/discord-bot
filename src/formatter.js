const parser = require('./parser.js');

exports.bill = function (bill) {
  return `**${parser.state(bill.state)} ${bill.bill_number}**: *${parser.title(bill)}* ${bill.last_action.toUpperCase()} as of \`${bill.last_action_date}\` (<${bill.url}>)\n`
}
