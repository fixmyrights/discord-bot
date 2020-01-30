const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

exports.readWatchlist = async function() {
  try {
    return JSON.parse(await readFile("watchlist.json"))
  } catch (err) {
    return {};
  }
}

exports.updateWatchlist = async function(watchlist) {
  await writeFile("watchlist.json", JSON.stringify(watchlist, null, "	"));
}
