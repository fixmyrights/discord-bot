const database = require('./database');
const cron = require('node-cron');
const formatter = require('./formatter');
const parser = require('./parser');
const legiscan = require('./services/legiscan');
const { logger } = require('./logger');

let task = null;

exports.schedule = function(client) {
  if (task) {
    task.stop();
  }

  const cronExpression = database.getConfig('cron');

  task = cron.schedule(cronExpression, async () => {
    const bills = await legiscan.search(database.getConfig('state'), database.getConfig('query'));

    if (bills) {
      logger.debug(`Found ${bills.length} bills in background.`);
      if (bills.length > 0) {
        await database.load();

        const channel = client.channels.find(channel => channel.name === database.getConfig('channel'));

        for (const bill of bills) {
          const updateReport = database.updateWatchlist(bill);

          if (updateReport.new) {
            await channel.send(`Found new bill ${formatter.bill(bill)}`);
          } else if (updateReport.progress) {
            await channel.send(`Bill **${parser.state(bill.state)} ${bill.number}** changed to ${updateReport.progress.stage} as of \`${formatter.date(updateReport.progress.timestamp)}\``);
          }
        }

        await channel.send(`Updated ${bills.length} automatically.`);

        await database.save();
      }
    } else {
      logger.debug('API error in background.');
    }
  });

  logger.success(`Background tasked scheduled with ${cronExpression}`);
};
