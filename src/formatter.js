const parser = require('./parser.js');

exports.bill = function(bill) {
  const recentHistoryItem = parser.recentHistory(bill);
  return `**${parser.state(bill.state)} ${bill.number}**: *${parser.title(bill)}* ${recentHistoryItem.action} as of \`${this.date(recentHistoryItem.timestamp)}\` (<${bill.url}>)\n`;
};

exports.date = function(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US');
};

exports.duration = function(timestamp) {
  const totalMillis = timestamp - Date.now();
  const totalSeconds = totalMillis / 1000;
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 60;
  const totalYears = totalDays / 365;

  const seconds = Math.round(totalSeconds);
  const minutes = Math.round(totalMinutes);
  const hours = Math.round(totalHours);
  const days = Math.round(totalDays);
  const years = Math.round(totalYears);

  if (years === 0) {
    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          if (seconds === 1) {
            return '1 second';
          } else {
            return `${seconds} seconds`;
          }
        } else if (minutes === 1) {
          return '1 minute';
        } else {
          return `${minutes} minutes`;
        }
      } else if (hours === 1) {
        return '1 hour';
      } else {
        return `${hours} hours`;
      }
    } else if (days === 1) {
      return '1 day';
    } else {
      return `${days} days`;
    }
  } else if (years === 1) {
    return '1 year';
  } else {
    return `${years} years`;
  }
};
