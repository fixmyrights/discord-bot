const parser = require('./parser.js');

exports.bill = function(bill) {
  const recentStatusItem = parser.recentProgress(bill);
  return `**${parser.state(bill.state)} ${bill.number}**: *${parser.title(bill)}* ${recentStatusItem.stage} as of \`${new Date(recentStatusItem.timestamp).toLocaleDateString('en-US')}\` (<${bill.url}>)\n`;
};
