const database = require('./database');
const cron = require('node-cron');
const formatter = require('./formatter');
const parser = require('./parser');
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

        for (const billSummary of bills) {
          const savedBill = savedBills[billSummary.id];

          if (!savedBill || savedBill.watching) {
            const bill = detail ? await legiscan.getBill(billSummary.id) : billSummary;

            const updateReport = database.updateBill(bill);

            if (updateReport.new) {
              await channel.send(`Found new bill ${formatter.bill(bill)}`);
            } else {
              if (updateReport.progress) {
                await channel.send(`Bill **${parser.state(bill.state)} ${bill.number}** changed to ${updateReport.progress.action} as of \`${formatter.date(updateReport.progress.timestamp)}\``);
              }

              if (updateReport.hearing) {
                await channel.send(
                  `${updateReport.hearing.type || 'Hearing'} for bill **${parser.state(bill.state)} ${bill.number}** scheduled for ${updateReport.hearing.localDate} at ${updateReport.hearing.localTime}, which is ${formatter.duration(updateReport.hearing.timestamp)}. The hearing is described as ${
                    updateReport.hearing.description
                  }. For more information, visit <${bill.url}>`
                );
              }
            }
          } else {
            logger.debug(`Will ignore bill ${billSummary.id}.`);
          }
        }

        await channel.send(`Updated ${bills.length} bills automatically.`);

        await database.save();
      }
    } else {
      logger.debug('API error in background.');
    }
  });

  logger.success(`Background tasked scheduled with ${cronExpression}.`);
};
