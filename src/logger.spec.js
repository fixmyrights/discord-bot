const consola = require('consola');

const { logger } = require('src/logger');

describe('Logger', () => {
  beforeEach(() => {
    consola.mockTypes(() => jest.fn());
  });

  describe('logger', () => {
    it('returns a consola instance', () => {
      expect(logger).toBeDefined();
      expect(logger).toBeInstanceOf(consola.Consola);
    });
  });
});
