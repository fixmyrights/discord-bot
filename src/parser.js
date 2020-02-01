const states = require('../data/states.json');

exports.state = function(input) {
  if (!input) {
    return null;
  }

  const uppercaseInput = input.toUpperCase();

  if (uppercaseInput === 'ALL') {
    return uppercaseInput;
  }

  const state = states.find(state => [state.name, state.code].includes(uppercaseInput));

  return state ? state.code : null;
};

exports.titleRelevance = function(title) {
  let relevant = false;

  if (title.includes('right to repair')) {
    relevant = true;
  } else if ((title.includes('fair') || title.includes('right')) && (title.includes('digital') || title.includes('electronic')) && (title.includes('repair') || title.includes('serv'))) {
    relevant = true;
  }

  return relevant;
};

exports.title = function(bill) {
  let title = bill.title.toLowerCase();
  title = title.replace(/-/g, ' ');

  return title.length > 497 ? `${title.substring(0, 497)}...` : title;
};
