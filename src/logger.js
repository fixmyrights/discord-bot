const consola = require('consola');

const logger = consola.create({
  level: process.env.NODE_ENV === 'production' ? 3 : 4
});

logger.wrapAll();

module.exports = {
  logger
};
