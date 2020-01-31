const fs = require("fs");
const util = require("util");

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const databaseDirectory = "./database/";

exports.readWatchlist = async function() {
	try {
		return JSON.parse(await readFile(`${databaseDirectory}watchlist.json`));
	} catch (err) {
		return {};
	}
}

exports.updateWatchlist = async function(watchlist) {
	if (!await exists(databaseDirectory)) {
		await mkdir(databaseDirectory);
	}

	await writeFile(`${databaseDirectory}watchlist.json`, JSON.stringify(watchlist, null, "	"));
}
