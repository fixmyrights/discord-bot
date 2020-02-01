const database = require('./database');
const cron = require('node-cron');
const legiscan = require('./services/legiscan');
const { logger } = require('./logger');

let task = null;

exports.schedule = function(client) {
  if (task) {
    task.stop();
  }

  const cronExpression = database.getConfig('cron');

  task = cron.schedule(cronExpression, async () => {
    const bills = await legiscan.search('WA', database.getConfig('query'));

    if (bills) {
      logger.debug(`Found ${bills.length} bills in background.`);
      if (bills.length > 0) {
        await database.load();

        for (const bill of bills) {
          database.updateWatchlist(bill);
        }

        const channel = client.channels.find('name', database.getConfig('channel'));
        await channel.send(`Updated ${bills.length} automatically.`);

        await database.save();
      }
    } else {
      logger.debug('API error in background.');
    }
  });

  logger.success(`Background tasked scheduled with ${cronExpression}`);
};
