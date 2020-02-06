const database = require('./database');
const cron = require('node-cron');
const formatter = require('./formatter');
const legiscan = require('./services/legiscan');
const { logger } = require('./logger');

let task = null;

// Can't query with detail too often
let detailTimestamp = 0;

exports.schedule = function(client) {
  if (task) {
    task.stop();
  }

  const cronExpression = database.getConfig('cron');

  task = cron.schedule(cronExpression, async () => {
    if (!database.getConfig('channel')) {
      logger.debug('Skipped background task because channel is not set.');
      return;
    }

    const bills = await legiscan.search(database.getConfig('state'), database.getConfig('query'));

    if (bills) {
      logger.debug(`Found ${bills.length} bills in background.`);
      if (bills.length > 0) {
        await database.load();

        const channel = client.channels.find(channel => channel.name === database.getConfig('channel'));

        const savedBills = database.getBills();

        let detail = false;
        if (Date.now() > detailTimestamp + database.getConfig('interval') * 60000) {
          detail = true;
          // Make sure any watched bills that don't show up in the search results are scanned
          for (const savedBillId in savedBills) {
            const savedBill = { ...savedBills[savedBillId], id: savedBillId };
            if (savedBill.watching && !bills.find(bill => bill.id === savedBill.id)) {
              logger.debug(`Will update manually added bill ${savedBill.id}.`);
              bills.push(savedBill);
            }
          }
          detailTimestamp = Date.now();
          logger.debug('Will get bill details this time.');
        }

        const billHearingsReminders = [];

        for (const billSummary of bills) {
          const savedBill = savedBills[billSummary.id];

          if (!savedBill || savedBill.watching) {
            const bill = detail ? await legiscan.getBill(billSummary.id) : billSummary;

            const updateReport = database.updateBill(bill);

            if (updateReport.hearingReminders) {
              billHearingsReminders.push({ bill, hearingReminders: updateReport.hearingReminders });
            }

            await formatter.updateBill(bill, updateReport, channel);
          } else {
            logger.debug(`Will ignore bill ${billSummary.id}.`);
          }
        }

        if (billHearingsReminders.length > 0) {
          await formatter.reminders(billHearingsReminders, channel);
        }

        await channel.send(detail ? `Automatic scan returned detailed results for ${bills.length} bills.` : `Automatic scan returned ${bills.length} bills.`);

        await database.save();
      }
    } else {
      logger.debug('API error in background.');
    }
  });

  logger.success(`Background tasked scheduled with ${cronExpression}.`);
};
