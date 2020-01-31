const fs = require('fs').promises;
const databaseDirectory = './database/';
let database = {};
let dirty = false;

exports.load = async function() {
	try {
		database = JSON.parse(
			await fs.readFile(`${databaseDirectory}database.json`, 'utf8'),
		);
		dirty = false;
	} catch (err) {}
};

exports.update = function(bill) {
	dirty = true;

	if (!database.watchlist) {
		database.watchlist = {};
	}

	if (bill.bill_id in database.watchlist) {
		if (bill.last_action != database.watchlist[bill.bill_id].last_action) {
			console.log('Bill changed!');
		}
		database.watchlist[bill.bill_id].last_action = bill.last_action;
		database.watchlist[bill.bill_id].last_action_date =
			bill.last_action_date;
	} else {
		database.watchlist[bill.bill_id] = {
			title: bill.title,
			state: bill.state,
			status:
				new Date(bill.last_action_date) > new Date(2019, 0, 1)
					? 'new'
					: 'expired',
			bill_number: bill.bill_number,
			last_action: bill.last_action,
			last_action_date: bill.last_action_date,
		};
	}
};

exports.save = async function(watchlist) {
	if (!(await fs.exists(databaseDirectory))) {
		await fs.mkdir(databaseDirectory);
	}

	await fs.writeFile(
		`${databaseDirectory}database.json`,
		JSON.stringify(database, null, '	'),
	);
	dirty = false;
};
