const mockDiscordApiKey = 'DISCORD_API_KEY';
const mockDiscordApiKeyOther = 'DISCORD_API_KEY_OTHER';

jest.mock('discord.js/src/client/Client', () => {
  const Client = jest.requireActual('discord.js/src/client/Client');
  Client.prototype.login = jest.fn();
  return Client;
});

describe('Index', () => {
  describe("client 'ready' event", () => {
    xit('loads the database', () => {});
    xit('schedules the background cron job', () => {});
  });

  describe("client 'message' event", () => {
    xit('reacts to a mention', () => {});
    xit('does not react when not mentioned', () => {});
    xit('passes messages in the configured channel and with the configured prefix', () => {});
    xit('does not pass messages outside of the configured channel', () => {});
    xit('does not pass messages without the configured prefix', () => {});
  });

  describe('client login', () => {
    let loginSpy;

    beforeEach(() => {
      loginSpy = jest.spyOn(require('discord.js').Client.prototype, 'login');
    });

    it('uses environment variable when available', () => {
      process.env.DISCORD_CLIENT_KEY = mockDiscordApiKey;
      jest.mock('../data/credentials.json', () => ({ client: mockDiscordApiKeyOther }), { virtual: true });
      require('./index');

      expect(mockDiscordApiKey).not.toBe(mockDiscordApiKeyOther);
      expect(process.env.DISCORD_CLIENT_KEY).toBe(mockDiscordApiKey);
      expect(require('../data/credentials.json').client).toBe(mockDiscordApiKeyOther);
      expect(loginSpy).lastCalledWith(mockDiscordApiKey);
    });

    it('uses data/credentials.json client key when available and no environment variable', () => {
      delete process.env.DISCORD_CLIENT_KEY;
      jest.mock('../data/credentials.json', () => ({ client: mockDiscordApiKey }), { virtual: true });
      require('./index');

      expect(process.env.DISCORD_CLIENT_KEY).toBeFalsy();
      expect(require('../data/credentials.json').client).toBe(mockDiscordApiKey);
      expect(loginSpy).lastCalledWith(mockDiscordApiKey);
    });

    it('uses null key when no other option available', () => {
      delete process.env.DISCORD_CLIENT_KEY;
      jest.mock('../data/credentials.json', () => ({}), { virtual: true });
      require('./index');

      expect(process.env.DISCORD_CLIENT_KEY).toBeFalsy();
      expect(require('../data/credentials.json').client).toBeFalsy();
      expect(loginSpy).lastCalledWith(null);
    });
  });
});
