const mockDiscordApiKey = 'DISCORD_API_KEY';
const mockDiscordApiKeyOther = 'DISCORD_API_KEY_OTHER';
const mockDiscordClientUser = { tag: 'DISCORD_CLIENT_USER_TAG' };
const mockConfigChannel = '#CONFIG-CHANNEL';
const mockConfigPrefix = 'CONFIG-PREFIX';

jest.mock('discord.js/src/client/Client', () => {
  const Client = jest.requireActual('discord.js/src/client/Client');
  Client.prototype.login = jest.fn();
  return Client;
});
jest.mock('./database', () => {
  const database = jest.genMockFromModule('./database');
  database.getConfig = jest.fn(config => {
    if (config === 'channel') {
      return mockConfigChannel;
    } else if (config === 'prefix') {
      return mockConfigPrefix;
    } else {
      return 'no mock';
    }
  });
  return database;
});
jest.mock('./background');
jest.mock('./commands/handler');
jest.mock('./logger');
jest.mock('../data/credentials.json', () => ({}), { virtual: true });

const database = require('./database');
const background = require('./background');

describe('Index', () => {
  describe("client 'ready' event", () => {
    const client = require('./index');
    client.user = mockDiscordClientUser;

    beforeAll(() => {
      client.emit('ready');
    });

    it('loads the database', () => {
      expect(database.load).toBeCalledWith();
    });

    it('schedules the background cron job', () => {
      expect(background.schedule).toBeCalledWith(client);
    });
  });

  describe("client 'message' event", () => {
    xit('reacts to a mention', () => {});
    xit('does not react when not mentioned', () => {});
    xit('passes messages in the configured channel and with the configured prefix', () => {});
    xit('does not pass messages outside of the configured channel', () => {});
    xit('does not pass messages without the configured prefix', () => {});
  });

  describe('client login', () => {
    it('uses environment variable when available', () => {
      process.env.DISCORD_CLIENT_KEY = mockDiscordApiKey;
      jest.mock('../data/credentials.json', () => ({ client: mockDiscordApiKeyOther }), { virtual: true });
      const client = require('./index');

      expect(mockDiscordApiKey).not.toBe(mockDiscordApiKeyOther);
      expect(process.env.DISCORD_CLIENT_KEY).toBe(mockDiscordApiKey);
      expect(require('../data/credentials.json').client).toBe(mockDiscordApiKeyOther);
      expect(client.login).toBeCalledWith(mockDiscordApiKey);
    });

    it('uses data/credentials.json client key when available and no environment variable', () => {
      delete process.env.DISCORD_CLIENT_KEY;
      jest.mock('../data/credentials.json', () => ({ client: mockDiscordApiKey }), { virtual: true });
      const client = require('./index');

      expect(process.env.DISCORD_CLIENT_KEY).toBeFalsy();
      expect(require('../data/credentials.json').client).toBe(mockDiscordApiKey);
      expect(client.login).toBeCalledWith(mockDiscordApiKey);
    });

    it('uses null key when no other option available', () => {
      delete process.env.DISCORD_CLIENT_KEY;
      jest.mock('../data/credentials.json', () => ({}), { virtual: true });
      const client = require('./index');

      expect(process.env.DISCORD_CLIENT_KEY).toBeFalsy();
      expect(require('../data/credentials.json').client).toBeFalsy();
      expect(client.login).toBeCalledWith(null);
    });
  });
});
