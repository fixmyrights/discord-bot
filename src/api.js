const axios = require('axios');
const { logger } = require('./logger');
const credentials = require('../data/credentials.json');

const endpoint = 'https://api.legiscan.com';

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
