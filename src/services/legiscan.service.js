const { stringify: querystring } = require('querystring');
const axios = require('axios');
const createError = require('axios/lib/core/createError');

const { logger } = require('../logger');
const { title: parseTitle, titleRelevance, timestamp } = require('../parser');

const baseURL = process.env.LEGISCAN_ENDPOINT || 'https://api.legiscan.com';
const timeout = process.env.LEGISCAN_TIMEOUT || 60 * 1000;

exports.Legiscan = class Legiscan {
  static get client() {
    const client = axios.create({
      timeout,
      baseURL
    });

    client.interceptors.request.use(
      config => {
        config.params = config.params || {};

        if (!config.params.key) {
          config.params.key = process.env.LEGISCAN_API_KEY;
        }

        const { url, method, params } = config;

        logger.debug(`>> ${method.toUpperCase()} ${baseURL} ${url} ${querystring({ ...params, key: 'redacted' })}`);

        return config;
      },
      error => Promise.reject(error)
    );

    client.interceptors.response.use(
      response => {
        const { status, statusText, data, config, request } = response;

        logger.debug(`<< ${status} ${statusText}`);
        logger.trace(`<< ${JSON.stringify(data)}`);

        if (data.status === 'ERROR') {
          throw createError(`Legiscan: ${data.alert.message}`, config, data.status, request, response);
        }

        return response;
      },
      error => Promise.reject(error)
    );

    return client;
  }

  static async getBill(id) {
    try {
      const { data } = Legiscan.client.get('/', {
        op: 'getBill',
        id
      });
      const { bill_id: billId, state, bill_number: number, title, history, calendar } = data.bill;

      return {
        state,
        number,
        title,
        id: billId,
        history: (history || []).map(item => ({ action: item.action, timestamp: new Date(item.date).valueOf() })),
        calendar: (calendar || []).map(item => {
          const { type, description, date: localDate, time: localTime, location } = item;

          return {
            type,
            description,
            localDate,
            localTime,
            location,
            timestamp: timestamp(localDate, localTime, state)
          };
        })
      };
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  static async search(state, query) {
    try {
      const { data } = await Legiscan.client.get('/', {
        params: {
          op: 'search',
          state,
          query,
          year: 1
        }
      });

      const { searchresult: bills } = data;

      if (!bills.length) {
        return [];
      }

      return bills
        .reduce((acc, bill) => {
          if (!bill.text_url || !titleRelevance(parseTitle(bill))) {
            return acc;
          }

          const { bill_id: billId, state, bill_number: number, title, url, last_action: action, last_action_date: timestamp } = bill;

          acc.push({
            state,
            number,
            url,
            title,
            id: `${billId}`,
            history: [{ action, timestamp: new Date(timestamp).valueOf() }]
          });

          return acc;
        }, [])
        .sort((a, b) => b.history[0].timestamp - a.history[0].timestamp);
    } catch (err) {
      logger.error(err);
      return [];
    }
  }
};
