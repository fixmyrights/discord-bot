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

exports.save = async function (watchlist) {
	const writeFile = () => fs.writeFile(
		`${databaseDirectory}${databaseFile}`,
		JSON.stringify(database, null, '	')
	).then(() => global.dirty = false);

	const mkdirsAndWriteFile = async () => {
		const dirParts = databaseDirectory.split('/').filter((d, j) => d.length > 0 || j === 0); // `j === 0` in case the start is at root
		const joinDirParts = (i) => dirParts.filter((p, j) => j < i).join('/');
		const mkdir = (i) => fs.mkdir(joinDirParts(i));
		var i = dirParts.length;
		var lastError;

		for ( ; i > 0; i--) {
			try {
				await mkdir(i);
				break;
			} catch (err) {
				lastError = err;
				if (err.code === 'ENOENT') {
					continue; // verbose for verbosity's sake
				} else if (err.code === 'EEXIST') {
					console.warn(`database.js:save: the directory ${joinDirParts(i)} already exists, retrying the next directories down in the tree (unexpected)`); // big warn
					break;
				} else {
					console.warn(`database.js:save: unhandled error [1]\n${err}`); // big warn, but continue
				}
			}
		}

		if (i > 0) {
			for (i++; i < dirParts.length + 1; i++) {
				try {
					await mkdir(i);
				} catch (err) {
					console.warn(`database.js:save: unhandled error [2]\n${err}`); // big warn, but continue
				}
			}
			return writeFile();
		} else {
			console.warn(`database.js:save: could not make any of the directories in the tree ${databaseDirectory}`); // big warn
			return Promise.reject(lastError); // for sanity
		}
	};

	try {
		await writeFile();
	} catch (err) {
		if (err.code === 'ENOENT') {
			mkdirsAndWriteFile();
		} else {
			console.warn(`database.js:save: unhandled error [4]\n${err}`); // big warn
		}
	}
};
