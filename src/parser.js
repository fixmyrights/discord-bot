const states = require('../data/states.json');

exports.state = async function(input) {
	const uppercaseInput = input.toUpperCase();

	if (uppercaseInput === 'ALL') {
		return uppercaseInput;
	}

	const stateByName = states.find(state => state.name === uppercaseInput);
	const stateByCode = states.find(state => state.code === uppercaseInput);

	return (stateByName || stateByCode || { code: null }).code;
};

exports.titleRelevance = async function(title) {
	let relevant = false;

	if (title.includes('right to repair')) {
		relevant = true;
	} else if (
		(title.includes('fair') || title.includes('right')) &&
		(title.includes('digital') || title.includes('electronic')) &&
		(title.includes('repair') || title.includes('serv'))
	) {
		relevant = true;
	}

	return relevant;
};

exports.title = async function(bill) {
	let title = bill.title.toLowerCase();
	title = title.replace(/-/g, ' ');

	return title.length > 497 ? `${title.substring(0, 497)}...` : title;
};
