const parser = require('./parser.js');

exports.bill = function(bill) {
  const recentHistoryItem = parser.recentHistory(bill);
  return `**${parser.state(bill.state)} ${bill.number}**: *${parser.title(bill)}* ${recentHistoryItem.action} as of \`${this.date(recentHistoryItem.timestamp)}\` (<${bill.url}>)\n`;
};

exports.date = function(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US');
};
