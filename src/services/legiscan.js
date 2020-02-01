
const axios = require('axios');
const { logger } = require('./../logger');
const credentials = require('./../../data/credentials.json');
const parser = require('./../parser');

const endpoint = 'https://api.legiscan.com';

const config = require('./../../data/config.json');
const debug = config.debug;

const sortBills = bills => bills.sort((a, b) => new Date(b.last_action_date) - new Date(a.last_action_date));

exports.search = async function(state, query) {
  const result = await axios.get(endpoint, {
    params: {
      key: credentials.key || credentials.keys[state],
      op: 'search',
      state,
      query,
      year: 1
    }
  });

  const response = result.data;

  if (response.status === 'OK') {
    return response;
  }

  logger.error('API error:');
  logger.error(response);
  return null;
};


exports.getBills = response => {
  const bills = [];
  for (const billIndex in response.searchresult) {
    const bill = response.searchresult[billIndex];
    if (!bill.text_url) {
      continue;
    }
    const title = parser.title(bill);
    if (parser.titleRelevance(title)) {
      debug && logger.debug(`Found bill "${title}"`);
      bills.push(bill);
    } else {
      debug && logger.debug(`Ignored bill "${title}"`);
    }
  }

  // Most recently updated at the top
  sortBills(bills);

  return bills;
};
