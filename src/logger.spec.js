const consola = require('consola');

describe('Logger', () => {
  beforeEach(() => {
    consola.mockTypes(() => jest.fn());
  });

  describe('logger', () => {
    const OLD_ENV = process.env;

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it('returns a consola instance', () => {
      const { logger } = require('src/logger');
      expect(logger).toBeDefined();
      expect(logger).toBeInstanceOf(consola.Consola);
    });

    it('return a prod consola instance', () => {
      process.env = { ...OLD_ENV };
      delete process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const { logger } = require('src/logger');

      expect(logger).toBeDefined();
      expect(logger).toBeInstanceOf(consola.Consola);
    });
  });
});
