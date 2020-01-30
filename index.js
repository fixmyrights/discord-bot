const Discord = require("discord.js");
const api = require("./api");
const client = new Discord.Client();
const database = require("./database");
const credentials = require("./credentials.json");
const parser = require("./parser");

const query = `"right to repair" OR "right-to-repair" OR ((servicing OR repair) AND electronics) OR (fair AND electronic AND repair OR independent)`;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

const sortBills = bills => bills.sort((a, b) => new Date(b.last_action_date) - new Date(a.last_action_date));

client.on('message', async message => {
	const channel = message.channel;

	if (channel.name && channel.name.includes("legi") && message.cleanContent.startsWith("!")) {
		const command = message.cleanContent.substring(1);
		const segments = command.split(" ");

		if (command == "ping") {
			message.reply('pong');
		} else if (command == "help") {
			message.reply("Type `!query [state name or 2 letter code]`")
		} else if (command.startsWith("query ") || command.startsWith("scan ")) {
			if (segments.length != 2) {
				message.reply("Expected 1 argument, the two-letter state code.");
			} else {
				const state = parser.state(segments.splice(1).join(" "));

				if (!state) {
					message.reply("Could not find state.");
				} else if (!credentials.key && !(state in credentials.keys)) {
					message.reply(`No LegiScan API key for state code ${state}.`);
				} else {
					channel.send(`Scanning for right-to-repair legislation in ${state}...`);

					const response = await api.search(state, query);

					// Debug
					//console.log(response.searchresult);

					if (response) {
						let searchResult = "";
						let bills = [];
						for (let billIndex in response.searchresult) {
							const bill = response.searchresult[billIndex];
							if (!bill.text_url) {
								continue;
							}
							const title = parser.title(bill);
							if (parser.titleRelevance(title)) {
								console.log(`Found bill "${title}"`);
								bills.push(bill);
							} else {
								console.log(`Ignored bill "${title}"`);
							}
						}

						// Most recently updated at the top
						sortBills(bills);

						if (bills.length > 0) {
							watchlist = await database.readWatchlist();

							for (let bill of bills) {
								if (bill.bill_id in watchlist) {
									// TODO: Track changes
									watchlist[bill.bill_id].last_action = bill.last_action;
									watchlist[bill.bill_id].last_action_date = bill.last_action_date;
								} else {
									watchlist[bill.bill_id] = {title: bill.title, state: bill.state, status: new Date(bill.last_action_date) > new Date(2019, 0, 1) ? "new" : "expired", bill_number: bill.bill_number, last_action: bill.last_action, last_action_date: bill.last_action_date};
								}
								if (searchResult.length > 500) {
									// Discord only supports 2000 max, so split into multiple messages
									await channel.send(searchResult);
									searchResult = "";
								}
								searchResult += `**${bill.bill_number}**: *${bill.title}* ${bill.last_action.toUpperCase()} as of \`${bill.last_action_date}\` (<${bill.text_url}>)\n`;
							}

							await database.updateWatchlist(watchlist);
						} else {
							searchResult += `No current legislation found.`;
						}
						await channel.send(searchResult);
					} else {
						message.reply("LegiScan API error.");
					}
				}
			}
		}
	}
});

client.login(credentials.client);
