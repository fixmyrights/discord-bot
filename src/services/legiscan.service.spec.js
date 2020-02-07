const consola = require('consola');
const { Legiscan } = require('src/services/legiscan.service');

describe('Legiscan Service', () => {
  beforeAll(() => {
    consola.wrapAll();
  });

  beforeEach(() => {
    consola.mockTypes(() => jest.fn());
  });

  describe('client', () => {
    let subject;

    beforeEach(() => {
      subject = Legiscan.client;
    });

    describe('when LEGISCAN_ENDPOINT is not defined', () => {
      const prevEnv = process.env;

      beforeEach(() => {
        delete process.env.LEGISCAN_ENDPOINT;
      });

      afterEach(() => {
        process.env = prevEnv;
      });

      it('fallbacks to the default endpoint', () => {
        expect(subject.defaults.baseURL).toEqual('https://api.legiscan.com');
      });
    });

    describe('when LEGISCAN_ENDPOINT is defined', () => {
      const prevEnv = process.env;
      const userEndpoint = 'httpss://my.custom.endpoint';

      beforeEach(() => {
        process.env.LEGISCAN_ENDPOINT = userEndpoint;
        const { Legiscan } = require('src/services/legiscan.service');
        subject = Legiscan.client;
      });

      afterEach(() => {
        process.env = prevEnv;
      });

      it('defines the user default as the default base url', () => {
        expect(subject.defaults.baseURL).toEqual(userEndpoint);
      });
    });

    describe('when LEGISCAN_TIMEOUT is not defined', () => {
      const prevEnv = process.env;

      beforeEach(() => {
        delete process.env.LEGISCAN_TIMEOUT;
      });

      afterEach(() => {
        process.env = prevEnv;
      });

      it('fallbacks to default endpoint', () => {
        expect(subject.defaults.timeout).toEqual(60 * 1000);
      });
    });

    describe('when LEGISCAN_TIMEOUT defined', () => {
      const prevEnv = process.env;
      const userTimeout = 30 * 1000;

      beforeEach(() => {
        process.env.LEGISCAN_TIMEOUT = userTimeout;
        const { Legiscan } = require('src/services/legiscan.service');
        subject = Legiscan.client;
      });

      afterEach(() => {
        process.env = prevEnv;
      });

      it('defines the expected timeout', () => {
        expect(subject.defaults.timeout).toEqual(userTimeout.toString());
      });
    });
  });

  describe('client.interceptors.request', () => {
    describe('fulfilled()', () => {
      const prevEnv = process.env;
      const defaultConfig = {
        method: 'get',
        url: 'https://url',
        baseUrl: '/'
      };
      let subject;

      beforeEach(() => {
        const [interceptor] = Legiscan.client.interceptors.request.handlers;
        subject = interceptor.fulfilled;
      });

      afterEach(() => {
        process.env = prevEnv;
      });

      describe('when config.params is not defined', () => {
        const config = { ...defaultConfig };

        it('initializes config.params with an empty object', () => {
          expect(config.params).not.toBeDefined();
          const output = subject(config);
          expect(output.params).toBeDefined();
        });
      });

      describe('when key is not defined in the configuration object', () => {
        const config = { ...defaultConfig };

        it('initializes config.key with LEGISCAN_API_KEY.', () => {
          process.env.LEGISCAN_API_KEY = '<api-key>';
          const output = subject(config);
          expect(output.params).toBeDefined();
          expect(output.params.key).toEqual(process.env.LEGISCAN_API_KEY);
        });
      });

      describe('when config.params and params.key are defined', () => {
        const config = {
          ...defaultConfig,
          params: {
            key: '<key>',
            op: 'search'
          }
        };

        it('maps the provided parameters', () => {
          const output = subject(config);
          expect(output.params).toBeDefined();
          expect(output).toEqual(config);
        });
      });
    });

    describe('rejected()', () => {
      let subject;
      const error = {};

      beforeEach(() => {
        const [interceptor] = Legiscan.client.interceptors.request.handlers;
        subject = interceptor.rejected;
      });

      it('rejects the provided error', () => {
        expect(subject(error)).rejects.toEqual(error);
      });
    });
  });

  describe('client.interceptors.response', () => {
    describe('fulfilled()', () => {
      const defaultResponse = {
        status: 200,
        statusText: 'OK',
        data: {},
        config: {},
        request: {}
      };
      let subject;

      beforeEach(() => {
        const [interceptor] = Legiscan.client.interceptors.response.handlers;
        subject = interceptor.fulfilled;
      });

      describe('when response is successful', () => {
        const response = { ...defaultResponse };

        it('returns the response', () => {
          const output = subject(response);
          expect(output).toEqual(response);
        });
      });

      describe('when response is an error', () => {
        const response = {
          ...defaultResponse,
          data: {
            status: 'ERROR',
            alert: {
              message: '<message>'
            }
          }
        };

        it('throws a response error', () => {
          expect(() => {
            subject(response);
          }).toThrow('<message>');
        });
      });
    });

    describe('rejected()', () => {
      let subject;
      const error = {};

      beforeEach(() => {
        const [interceptor] = Legiscan.client.interceptors.response.handlers;
        subject = interceptor.rejected;
      });

      it('rejects the provided error', () => {
        expect(subject(error)).rejects.toEqual(error);
      });
    });
  });

  describe('getBill()', () => {});

  describe('search()', () => {});
});
