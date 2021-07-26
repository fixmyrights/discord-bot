const { promises: fs } = require('fs');
const { logger } = require('./logger');
const parser = require('./parser');
const config = require('../data/default-config.json');

const databaseDirectory = './database/';
const databaseFile = 'database.json';
let database = {};

exports.load = async function () {
  try {
    database = JSON.parse(await fs.readFile(`${databaseDirectory}${databaseFile}`, 'utf8'));
    global.dirty = false;
  } catch (err) {}
};

exports.getConfig = function (key) {
  return database.config && key in database.config ? database.config[key] : config[key];
};

exports.getBills = function () {
  return database.bill || {};
};

exports.getBill = function (state, billNumber) {
  for (const billId in database.bill || {}) {
    const bill = database.bill[billId];

    if (bill.state === state && bill.number === billNumber) {
      return { ...bill, id: billId };
    }
  }

  return null;
};

exports.setConfig = function (key, value) {
  global.dirty = true;

  if (!database.config) {
    database.config = {};
  }

  database.config[key] = value;
};

exports.setBill = function (bill) {
  if (!bill.id) {
    logger.debug('Cannot set bill without id.');
    return;
  }

  global.dirty = true;

  if (!database.bill) {
    database.bill = {};
  }

  // Don't store id inside bill as it is the key
  database.bill[bill.id] = { ...bill, id: undefined };
};

exports.updateBill = function (bill) {
  global.dirty = true;

  const updateReport = {};

  if (!database.bill) {
    database.bill = {};
  }

  const now = Date.now();
  const reminderMillis = this.getConfig('reminder') * 24 * 60 * 60 * 1000;

  if (bill.id in database.bill) {
    updateReport.new = false;
    const existingBill = database.bill[bill.id];
    bill.watching = existingBill.watching;

    // The subtle difference between history and calendar is that history is either retrieved one item at a time or all items at a time, while calendar is either retrieved all items at a time or none at all
    if (existingBill.history) {
      const lastestHistoryItem = parser.recentHistory(bill);
      if (!existingBill.history.find(historyItem => historyItem.action === lastestHistoryItem.action && historyItem.timestamp === lastestHistoryItem.timestamp)) {
        updateReport.progress = lastestHistoryItem;
      }
      for (const existingHistoryItem of existingBill.history) {
        if (!bill.history.find(historyItem => historyItem.action === existingHistoryItem.action && historyItem.timestamp === existingHistoryItem.timestamp)) {
          bill.history.push(existingHistoryItem);
        }
      }
    }

    if (existingBill.calendar) {
      const newBillCalendar = Array.isArray(bill.calendar);
      if (newBillCalendar && bill.calendar.length > 0) {
        const latestCalendarItem = parser.recentHearing(bill);
        if (!existingBill.calendar.find(calendarItem => calendarItem.description === latestCalendarItem.description && calendarItem.location === latestCalendarItem.location && calendarItem.timestamp === latestCalendarItem.timestamp)) {
          updateReport.hearing = latestCalendarItem;
        }
      } else {
        bill.calendar = [];
      }

      for (const existingCalendarItem of existingBill.calendar) {
        if (existingCalendarItem.timestamp > now && existingCalendarItem.timestamp - now < reminderMillis) {
          if (!updateReport.hearingReminders) {
            updateReport.hearingReminders = [];
          }
          updateReport.hearingReminders.push(existingCalendarItem);
        }
        if (!newBillCalendar && !bill.calendar.find(calendarItem => calendarItem.description === existingCalendarItem.description && calendarItem.location === existingCalendarItem.location && calendarItem.timestamp === existingCalendarItem.timestamp)) {
          bill.calendar.push(existingCalendarItem);
        }
      }
    }
  } else {
    updateReport.new = true;
    bill.watching = true;
  }

  Array.isArray(bill.history) && bill.history.sort((a, b) => b.timestamp - a.timestamp);
  Array.isArray(bill.calendar) && bill.calendar.sort((a, b) => b.timestamp - a.timestamp);
  database.bill[bill.id] = { ...bill, id: undefined };

  return updateReport;
};

const undirty = function () {
  global.dirty = false;
};
const writeFile = function () {
  return fs.writeFile(`${databaseDirectory}${databaseFile}`, JSON.stringify(database, null, '	')).then(undirty);
};
exports.save = async function () {
  try {
    await writeFile();
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fs.mkdir(databaseDirectory, { recursive: true });
        await writeFile();
      } catch (err) {
        logger.error(err);
      }
    } else {
      logger.error(err);
    }
  }
};
