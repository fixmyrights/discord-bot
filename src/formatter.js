const parser = require('./parser.js');

exports.bill = function(bill) {
  const recentProgressItem = parser.recentProgress(bill);
  return `**${parser.state(bill.state)} ${bill.number}**: *${parser.title(bill)}* ${recentProgressItem.stage} as of \`${this.date(recentProgressItem.timestamp)}\` (<${bill.url}>)\n`;
};

exports.date = function(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US');
};
