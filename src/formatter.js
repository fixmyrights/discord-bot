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
  const totalSeconds = Math.abs(totalMillis / 1000);
  const totalMinutes = totalSeconds / 60;
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 60;
  const totalYears = totalDays / 365;

  const seconds = Math.round(totalSeconds);
  const minutes = Math.round(totalMinutes);
  const hours = Math.round(totalHours);
  const days = Math.round(totalDays);
  const years = Math.round(totalYears);

  let durationValue;

  if (years === 0) {
    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          if (seconds === 1) {
            durationValue = '1 second';
          } else {
            durationValue = `${seconds} seconds`;
          }
        } else if (minutes === 1) {
          durationValue = '1 minute';
        } else {
          durationValue = `${minutes} minutes`;
        }
      } else if (hours === 1) {
        durationValue = '1 hour';
      } else {
        durationValue = `${hours} hours`;
      }
    } else if (days === 1) {
      durationValue = '1 day';
    } else {
      durationValue = `${days} days`;
    }
  } else if (years === 1) {
    durationValue = '1 year';
  } else {
    durationValue = `${years} years`;
  }

  return `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
};
