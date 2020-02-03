const { RichEmbed } = require('discord.js');
const parser = require('./parser.js');
const Pagination = require('discord-paginationembed');

exports.bill = function(bill) {
  const recentHistoryItem = parser.recentHistory(bill);
  return `**${parser.state(bill.state)} ${bill.number}**: *${parser.title(bill)}* ${recentHistoryItem.action} as of \`${this.date(recentHistoryItem.timestamp)}\` (<${bill.url}>)\n`;
};

exports.billsRichEmbed = async function(bills, message) {
  const embeds = [];

  let embed = new RichEmbed().setTitle('List of Matching Bills').setTimestamp(new Date());
  for (const billIndex in bills) {
    const recentHistoryItem = parser.recentHistory(bills[billIndex]);
    const bill = bills[billIndex];

    embed.addField('Bill', `[**${parser.state(bill.state)} ${bill.number}**](${bill.url}): *${parser.title(bill)}* ${recentHistoryItem.action} as of \`${this.date(recentHistoryItem.timestamp)}\``);

    if (billIndex % 10 === 0) {
      console.log(embed.fields.length);
      embeds.push(embed);
      embed = new RichEmbed().setTitle('List of Matching Bills').setTimestamp(new Date());
    }
  }

  // cleanup for the last page
  if (embed.fields.length > 0) {
    embeds.push(embed);
  }

  const FieldsEmbed = new Pagination.Embeds()
    .setArray(embeds)
    .setAuthorizedUsers([message.author.id])
    .setChannel(message.channel)
    .setPageIndicator(true)
    // Do we keep the delete?
    .setDisabledNavigationEmojis(['DELETE']);

  await FieldsEmbed.build();
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
