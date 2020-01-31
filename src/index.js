// Discord
const Discord = require('discord.js');
const client = new Discord.Client();
const discordClientKey =
	process.env.DISCORD_CLIENT_KEY || credentials.client || null;
const database = require('./database');

// Legiscan API
const api = require('./api');
const credentials = require('../data/credentials.json');
const legiScanApiKey = process.env.LEGISCAN_API_KEY || credentials.key || null;

// Utility
const parser = require('./parser');
const debug = false;

const query =
	'"right to repair" OR "right-to-repair" OR ((servicing OR repair) AND electronics) OR (fair AND electronic AND repair OR independent)';

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

const sortBills = bills =>
	bills.sort(
		(a, b) => new Date(b.last_action_date) - new Date(a.last_action_date),
	);

client.on('message', async message => {
	const { channel } = message;

	if (
		channel.name &&
		channel.name.includes('legi') &&
		message.cleanContent.startsWith('!')
	) {
		const command = message.cleanContent.substring(1);
		const segments = command.split(' ');

		if (command === 'ping') {
			message.reply('pong');
		} else if (command === 'help') {
			message.reply('Type `!query [state name or 2 letter code]`');
		} else if (
			command.startsWith('query ') ||
			command.startsWith('scan ')
		) {
			const state = await parser.state(segments.splice(1).join(' '));

			if (!state) {
				message.reply('Could not find state.');
			} else if (!legiScanApiKey && !(state in credentials.keys)) {
				message.reply(`No LegiScan API key for state code ${state}.`);
			} else {
				channel.send(
					`Scanning for right-to-repair legislation in ${state}...`,
				);

				const response = await api.search(state, query);
				let searchResult = '';
				const bills = [];

				// Debug
				// console.log(response.searchresult);

				if (response) {
					if (response.searchresult) {
						for (const billIndex in response.searchresult) {
							const bill = response.searchresult[billIndex];
							if (!bill.text_url) {
								continue;
							}
							const title = await parser.title(bill);
							const relevance = await parser.titleRelevance(
								title,
							);
							if (relevance) {
								debug && console.log(`Found bill "${title}"`);
								bills.push(bill);
							} else {
								debug && console.log(`Ignored bill "${title}"`);
							}
						}
					}

					// Most recently updated at the top
					sortBills(bills);

					if (bills.length > 0) {
						const watchlist = await database.readWatchlist();

						for (const bill of bills) {
							if (bill.bill_id in watchlist) {
								// TODO: Track changes
								if (
									bill.last_action !==
									watchlist[bill.bill_id].last_action
								) {
									console.log('Bill changed!');
								}
								watchlist[bill.bill_id].last_action =
									bill.last_action;
								watchlist[bill.bill_id].last_action_date =
									bill.last_action_date;
							} else {
								watchlist[bill.bill_id] = {
									title: bill.title,
									state: bill.state,
									status:
										new Date(bill.last_action_date) >
										new Date(2019, 0, 1)
											? 'new'
											: 'expired',
									bill_number: bill.bill_number,
									last_action: bill.last_action,
									last_action_date: bill.last_action_date,
								};
							}
							if (searchResult.length > 500) {
								// Discord only supports 2000 max, so split into multiple messages
								await channel.send(searchResult);
								searchResult = '';
							}
							searchResult += `**${
								bill.bill_number
							}**: *${parser.title(
								bill,
							)}* ${bill.last_action.toUpperCase()} as of \`${
								bill.last_action_date
							}\` (<${bill.text_url}>)\n`;
						}

						await database.updateWatchlist(watchlist);
					} else {
						searchResult += 'No current legislation found.';
					}
					await channel.send(searchResult);
				} else {
					message.reply('LegiScan API error.');
				}
			}
		}
	}
});

client.login(discordClientKey);
