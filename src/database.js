const { promises: fs } = require('fs');
const { logger } = require('./logger');
const config = require('../data/default-config.json');

const databaseDirectory = './database/';
const databaseFile = 'database.json';
let database = {};

exports.load = async function() {
  try {
    database = JSON.parse(await fs.readFile(`${databaseDirectory}${databaseFile}`, 'utf8'));
    global.dirty = false;
  } catch (err) {}
};

exports.getConfig = function(key) {
  return database.config && database.config[key] ? database.config[key] : config[key];
};

exports.getBills = function() {
  return database.bill || {};
};

exports.getBill = function(state, billNumber) {
  for (const billId in database.bill || {}) {
    const bill = database.bill[billId];

    if (bill.state === state && bill.number === billNumber) {
      return { ...bill, id: billId };
    }
  }

  return null;
};

exports.setConfig = function(key, value) {
  global.dirty = true;

  if (!database.config) {
    database.config = {};
  }

  database.config[key] = value;
};

exports.setBill = function(bill) {
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

exports.updateBill = function(bill) {
  global.dirty = true;

  const updateReport = {};

  if (!database.bill) {
    database.bill = {};
  }

  if (bill.id in database.bill) {
    updateReport.new = false;
    const existingBill = database.bill[bill.id];
    bill.watching = existingBill.watching;

    if (existingBill.history) {
      if (!existingBill.history.find(progressItem => progressItem.action === bill.history[0].action)) {
        updateReport.progress = bill.history[0];
      }
      for (const existingHistoryItem of existingBill.history) {
        if (!bill.history.find(historyItem => historyItem.action === existingHistoryItem.action)) {
          bill.history.push(existingHistoryItem);
        }
      }
    }
  } else {
    updateReport.new = true;
    bill.watching = true;
  }

  database.bill[bill.id] = { ...bill, id: undefined };

  return updateReport;
};

const undirty = function() {
  global.dirty = false;
};
const writeFile = function() {
  return fs.writeFile(`${databaseDirectory}${databaseFile}`, JSON.stringify(database, null, '	')).then(undirty);
};
exports.save = async function() {
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
