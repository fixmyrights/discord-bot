const { promises: fs } = require('fs');

const databaseDirectory = './database/';
const databaseFile = 'database.json';
let database = {};

exports.load = async function() {
  try {
    database = JSON.parse(await fs.readFile(`${databaseDirectory}${databaseFile}`, 'utf8'));
    global.dirty = false;
  } catch (err) {}
};

exports.update = function(bill) {
  global.dirty = true;

  if (!database.watchlist) {
    database.watchlist = {};
  }

  if (bill.bill_id in database.watchlist) {
    if (bill.last_action !== database.watchlist[bill.bill_id].last_action) {
      console.log('Bill changed!');
    }
    database.watchlist[bill.bill_id].last_action = bill.last_action;
    database.watchlist[bill.bill_id].last_action_date = bill.last_action_date;
  } else {
    database.watchlist[bill.bill_id] = {
      title: bill.title,
      state: bill.state,
      status: new Date(bill.last_action_date) > new Date(2019, 0, 1) ? 'new' : 'expired',
      bill_number: bill.bill_number,
      last_action: bill.last_action,
      last_action_date: bill.last_action_date
    };
  }
};

const undirty = function () { global.dirty = false; };
const writeFile = function () {
  return fs.writeFile(
    `${databaseDirectory}${databaseFile}`,
    JSON.stringify(database, null, '	')
  ).then(undirty);
};
exports.save = async function (watchlist) {
  try {
    await writeFile();
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fs.mkdir(databaseDirectory, { recursive: true });
        await writeFile();
      } catch (err) {
        console.warn(`database:js:save: unhandled error [1]\n ${err}`);
      }
    } else {
      console.warn(`database.js:save: unhandled error [2]\n${err}`);
    }
  }
};
