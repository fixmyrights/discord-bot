const states = require('../data/states.json');

exports.recentHistory = function(bill) {
  const history = bill.history.concat();
  history.sort((a, b) => b.timestamp - a.timestamp);
  return history[0] || {};
};

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

exports.timestamp = function(date, time, stateInput) {
  const state = states.find(state => [state.name, state.code].includes(stateInput.toUpperCase())) || {};
  return Date.parse(`${date}T${time || '12:00'}:00.000${state.timezone || '+00:00'}`);
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

exports.toggle = function(value) {
  let bool = null;
  if (['on', 'enable', 'enabled', 'true'].includes(value)) {
    bool = true;
  } else if (['off', 'disable', 'disabled', 'false'].includes(value)) {
    bool = false;
  }
  return bool;
};
