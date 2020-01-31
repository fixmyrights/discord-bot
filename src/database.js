const fs = require('fs').promises;

const databaseDirectory = './database/';

exports.readWatchlist = async function() {
	try {
		return JSON.parse(
			await fs.readFile(`${databaseDirectory}watchlist.json`, 'utf8'),
		);
	} catch (err) {
		return {};
	}
};

exports.updateWatchlist = async function(watchlist) {
	if (!(await fs.exists(databaseDirectory))) {
		await fs.mkdir(databaseDirectory);
	}

	await fs.writeFile(
		`${databaseDirectory}watchlist.json`,
		JSON.stringify(watchlist, null, '	'),
	);
};
