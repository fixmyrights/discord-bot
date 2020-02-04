const axios = require('axios');
const { logger } = require('./../logger');
const parser = require('./../parser');

const endpoint = 'https://api.legiscan.com';

const sortBills = bills => bills.sort((a, b) => b.history[0].timestamp - a.history[0].timestamp);

exports.getBill = async function(id) {
  // A bill number was passed in instead of an id
  if (id.includes(' ')) {
    const result = await axios.get(endpoint, {
      params: {
        key: credentials.key,
        op: 'search',
        query: id.split(' ')[1],
        state: parser.state(id.split(' ')[0]),
        year: 1
      }
    });

    const response = result.data;

    if (result.status === 'OK') {
      console.log(response);
    } else {
      logger.error('API error:');
      logger.error(response.searchresult);
      return null;
    }
  }

  const result = await axios.get(endpoint, {
    params: {
      key: process.env.LEGISCAN_API_KEY,
      op: 'getBill',
      id
    }
  });

  const response = result.data;

  if (response.status === 'OK') {
    const bill = response.bill;
    const returnBill = {
      id: `${bill.bill_id}`,
      state: bill.state,
      number: bill.bill_number,
      title: bill.title,
      url: bill.url,
      history: (bill.history || []).map(historyItem => {
        return { action: historyItem.action, timestamp: new Date(historyItem.date).valueOf() };
      }),
      calendar: (bill.calendar || []).map(calendarItem => {
        return { type: calendarItem.type, description: calendarItem.description, localDate: calendarItem.date, localTime: calendarItem.time, location: calendarItem.location, timestamp: parser.timestamp(calendarItem.date, calendarItem.time, bill.state) };
      })
    };
    return returnBill;
  } else {
    logger.error('API error:');
    logger.error(response);
    return null;
  }
};

exports.search = async function(state, query) {
  const result = await axios.get(endpoint, {
    params: {
      key: process.env.LEGISCAN_API_KEY,
      op: 'search',
      state,
      query,
      year: 1
    }
  });

  const response = result.data;

  if (response.status === 'OK') {
    const bills = [];
    for (const billIndex in response.searchresult) {
      const bill = response.searchresult[billIndex];
      if (!bill.text_url || !parser.titleRelevance(parser.title(bill))) {
        continue;
      }
      bills.push({ id: `${bill.bill_id}`, state: bill.state, number: bill.bill_number, title: bill.title, url: bill.url, history: [{ action: bill.last_action, timestamp: new Date(bill.last_action_date).valueOf() }] });
    }
    return sortBills(bills);
  }

  logger.error('API error:');
  logger.error(response);
  return null;
};
