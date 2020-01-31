const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const databasePath = "./database/watchlist.json";

exports.readWatchlist = async function() {
	try {
		return JSON.parse(await readFile(databasePath));
	} catch (err) {
		return {};
	}
}

exports.updateWatchlist = async function(watchlist) {
	await writeFile(databasePath, JSON.stringify(watchlist, null, "	"));
}
