const parser = require('./parser.js');

exports.bill = function(bill) {
  const recentProgressItem = parser.recentProgress(bill);
  return `**${parser.state(bill.state)} ${bill.number}**: *${parser.title(bill)}* ${recentProgressItem.stage} as of \`${new Date(recentProgressItem.timestamp).toLocaleDateString('en-US')}\` (<${bill.url}>)\n`;
};
