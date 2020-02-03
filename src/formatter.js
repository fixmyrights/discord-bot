const { RichEmbed } = require('discord.js');
const parser = require('./parser.js');
const Pagination = require('discord-paginationembed');
const { uuid } = require('uuidv4');
const oneDay = 1000 * 60 * 60 * 24;
const timeoutForPageSwaps = 30 * 1000;
const paginationAmount = 5;
const richContextCache = {};

async function getDateOfHearing(timestamp) {
  if (timestamp) {
    return new Date(timestamp);
  }
  return undefined;
}

async function getTimeTilHearing(dateOfHearing) {
  if (dateOfHearing instanceof Date) {
    const todaysDate = new Date();
    const numberDaysAway = Math.round((dateOfHearing - todaysDate) / oneDay);
    return Math.sign(numberDaysAway) >= 0 ? numberDaysAway : 'Already passed';
  }

  return undefined;
}

async function generateEmbed(bills, startLocation = 0) {
  const embed = new RichEmbed()
    .setTitle('List of Matching Bills')
    .setDescription(`Page: ${startLocation / paginationAmount + 1}`)
    .setTimestamp(new Date());
  for (const bill of bills.slice(startLocation, startLocation + paginationAmount)) {
    const recentCalendarItem = parser.recentCalendar(bill);
    let fieldText = `**Title:** ${parser.title(bill)}\n`;
    fieldText += `**Url:** ${bill.url}\n`;

    if (recentCalendarItem) {
      const dateOfHearing = await getDateOfHearing(recentCalendarItem.timestamp);
      const numberDaysAway = await getTimeTilHearing(dateOfHearing);
      fieldText += `**${recentCalendarItem.type}:**\n`;
      fieldText += `**Scheduled Date:** ${dateOfHearing.toLocaleString('en-US')}\n`;
      fieldText += `**Days Til:** ${numberDaysAway}`;
    }

    embed.addField(`${parser.state(bill.state)} ${bill.number}`, fieldText);
  }

  return embed;
}

async function generateFieldEmbeds(bills, embedId, showMore, channel, authUsers, currentLocation = 0) {
  const embed = await generateEmbed(bills, currentLocation);
  richContextCache[embedId] = currentLocation;

  const fieldEmbeds = new Pagination.Embeds()
    .setArray([embed])
    .setAuthorizedUsers(authUsers)
    .setChannel(channel)
    .setTimeout(timeoutForPageSwaps)
    .setPageIndicator(true)
    .setDisabledNavigationEmojis(['ALL']);

  if (showMore) {
    fieldEmbeds.addFunctionEmoji('▶', async (user, instance) => {
      const startLocation = richContextCache[embedId] + paginationAmount;
      if (bills.slice(startLocation, startLocation + paginationAmount).length < paginationAmount) {
        const FieldsEmbed = await generateFieldEmbeds(bills, embedId, false, channel, authUsers, startLocation);
        await FieldsEmbed.build();
      } else {
        const FieldsEmbed = await generateFieldEmbeds(bills, embedId, true, channel, authUsers, startLocation);
        await FieldsEmbed.build();
      }
    });
  }

  return fieldEmbeds;
}

exports.billsRichEmbed = async function(bills, message) {
  const embedId = uuid();
  const showMore = bills.length < 5;

  const FieldsEmbed = await generateFieldEmbeds(bills, embedId, showMore, message.channel, [message.author.id]);
  await FieldsEmbed.build();
};

exports.backgroundBills = async function(bills, channel) {
  const embedId = uuid();
  const showMore = bills.length < 5;
  const FieldsEmbed = await generateFieldEmbeds(bills, embedId, showMore, channel, []);
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
