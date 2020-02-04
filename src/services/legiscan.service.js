const { stringify: querystring } = require('querystring');
const axios = require('axios');
const createError = require('axios/lib/core/createError');

const { logger } = require('./../logger');

const baseURL = process.env.LEGISCAN_ENDPOINT || 'https://api.legiscan.com';
const timeout = process.env.LEGISCAN_TIMEOUT || 10 * 1000;

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
};
