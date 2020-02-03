const mockDiscordApiKey = 'DISCORD_API_KEY';
const mockDiscordApiKeyOther = 'DISCORD_API_KEY_OTHER';
const mockDiscordClientUser = {
  id: 'DISCORD_CLIENT_USER_ID',
  tag: 'DISCORD_CLIENT_USER_TAG'
};
const mockConfigChannel = '#CONFIG-CHANNEL';
const mockConfigPrefix = 'CONFIG-PREFIX';

jest.mock('discord.js/src/client/Client', () => {
  const Client = jest.requireActual('discord.js/src/client/Client');
  Client.prototype.login = jest.fn();
  return Client;
});
jest.mock('discord.js/src/structures/Message');

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

const Discord = require('discord.js');
const database = require('./database');
const background = require('./background');

describe('client', () => {
  describe("'ready' event", () => {
    const client = require('./index');
    client.user = mockDiscordClientUser;

    beforeAll(() => {
      client.emit('ready');
    });

    it('loads the database', () => {
      expect(database.load).toBeCalledTimes(1);
      expect(database.load).toBeCalledWith();
    });

    it('schedules the background cron job', () => {
      expect(background.schedule).toBeCalledTimes(1);
      expect(background.schedule).toBeCalledWith(client);
    });
  });

  describe("'message' event", () => {
    const client = require('./index');
    let message;
    client.user = mockDiscordClientUser;

    beforeEach(() => {
      message = new Discord.Message();
    });

    describe('reactions', () => {
      beforeEach(() => {
        message.channel = { name: 'ANY' };
      });

      it('reacts when mentioned', () => {
        message.content = `SOME <@!${mockDiscordClientUser.id}> STRING`;
        // seems a bit more complicated to mock this -- message.mentions = new Discord.MessageMentions();
        client.emit('message', message);

        expect(message.react).toBeCalledTimes(1);
        expect(message.react).toBeCalledWith('😇');
      });

      it('does not react when not mentioned', () => {
        message.content = 'SOME STRING';
        client.emit('message', message);

        expect(message.react).not.toBeCalled();
      });
    });

    describe('command handling', () => {
      xit('passes to handler in the configured channel and with the configured prefix', () => {});
      xit('does not pass to handler outside of the configured channel', () => {});
      xit('does not pass to handler without the configured prefix', () => {});
    });
  });

  describe('login', () => {
    it('uses environment variable when available', () => {
      process.env.DISCORD_CLIENT_KEY = mockDiscordApiKey;
      jest.mock('../data/credentials.json', () => ({ client: mockDiscordApiKeyOther }), { virtual: true });
      const client = require('./index');

      expect(mockDiscordApiKey).not.toBe(mockDiscordApiKeyOther);
      expect(process.env.DISCORD_CLIENT_KEY).toBe(mockDiscordApiKey);
      expect(require('../data/credentials.json').client).toBe(mockDiscordApiKeyOther);
      expect(client.login).toBeCalledTimes(1);
      expect(client.login).toBeCalledWith(mockDiscordApiKey);
    });

    it('uses data/credentials.json client key when available and no environment variable', () => {
      delete process.env.DISCORD_CLIENT_KEY;
      jest.mock('../data/credentials.json', () => ({ client: mockDiscordApiKey }), { virtual: true });
      const client = require('./index');

      expect(process.env.DISCORD_CLIENT_KEY).toBeFalsy();
      expect(require('../data/credentials.json').client).toBe(mockDiscordApiKey);
      expect(client.login).toBeCalledTimes(1);
      expect(client.login).toBeCalledWith(mockDiscordApiKey);
    });

    it('uses null key when no other option available', () => {
      delete process.env.DISCORD_CLIENT_KEY;
      jest.mock('../data/credentials.json', () => ({}), { virtual: true });
      const client = require('./index');

      expect(process.env.DISCORD_CLIENT_KEY).toBeFalsy();
      expect(require('../data/credentials.json').client).toBeFalsy();
      expect(client.login).toBeCalledTimes(1);
      expect(client.login).toBeCalledWith(null);
    });
  });
});
