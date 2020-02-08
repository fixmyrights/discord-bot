const mockDiscordApiKey = 'DISCORD_API_KEY';
const mockDiscordClientUser = {
  id: 'DISCORD_CLIENT_USER_ID',
  tag: 'DISCORD_CLIENT_USER_TAG'
};
const mockConfigChannel = '#CONFIG-CHANNEL';
const mockConfigPrefix = 'CONFIG-PREFIX';
const mockMessageContentMention = `SOME <@!${mockDiscordClientUser.id}> STRING`;
const mockMessageContentNotMention = 'SOME STRING';
const mockMessageContentMatchingConfig = `${mockConfigPrefix} AND SOME TEXT`;
const mockMessageContentNotMatchingConfig = `NOT-${mockConfigPrefix}`;
const mockMessageChannelAny = { name: '#ANY' };
const mockMessageTextChannelMatchingConfig = { name: mockConfigChannel, type: 'text' };
const mockMessageTextChannelNotMatchingConfig = { name: `#NOT-${mockConfigChannel}`, type: 'text' };

const mentionReaction = '😇';

jest.mock('discord.js/src/client/Client', () => {
  const Client = jest.requireActual('discord.js/src/client/Client'); // we want our EventEmitter
  Client.prototype.login = jest.fn();
  return Client;
});
jest.mock('discord.js/src/structures/Message');

jest.mock('dotenv', () => {
  return {
    config: () => {
      process.env.DISCORD_TOKEN = mockDiscordApiKey;
    }
  };
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
jest.mock('./logger'); // silence!

const Discord = require('discord.js');
const database = require('./database');
const background = require('./background');
const commandHandler = require('./commands/handler');

const client = require('./index');
client.user = mockDiscordClientUser;

describe('client', () => {
  describe('events', () => {
    describe('ready', () => {
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

    describe('message', () => {
      let message;

      beforeEach(() => {
        message = new Discord.Message();
      });

      describe('reactions', () => {
        beforeEach(() => {
          message.channel = mockMessageChannelAny;
        });

        it('reacts when mentioned', () => {
          message.content = mockMessageContentMention;
          // seems a bit more complicated to mock this -- message.mentions = new Discord.MessageMentions();
          client.emit('message', message);

          expect(message.react).toBeCalledTimes(1);
          expect(message.react).toBeCalledWith(mentionReaction);
        });

        it('does not react when not mentioned', () => {
          message.content = mockMessageContentNotMention;
          client.emit('message', message);

          expect(message.react).not.toBeCalled();
        });
      });

      describe('command handling', () => {
        beforeEach(() => {
          commandHandler.handle.mockClear();
        });

        it('passes to handler in the configured channel and with the configured prefix', () => {
          message.content = mockMessageContentMatchingConfig;
          message.cleanContent = message.content;
          message.channel = mockMessageTextChannelMatchingConfig;
          client.emit('message', message);

          expect(commandHandler.handle).toBeCalledTimes(1);
          expect(commandHandler.handle).toBeCalledWith(message, client);
        });

        it('passes to handler without a configured channel and with the configured prefix', () => {
          // one-time mock
          jest.mock('./database', () => {
            const database = jest.genMockFromModule('./database');
            database.getConfig = jest.fn(config => {
              if (config === 'channel') {
                return undefined;
              } else if (config === 'prefix') {
                return mockConfigPrefix;
              } else {
                return 'no mock';
              }
            });
            return database;
          });

          const client = require('./index');
          const commandHandler = require('./commands/handler'); // require must be in same scope as mocks, (./database mock changed)
          client.user = mockDiscordClientUser;
          message.content = mockMessageContentMatchingConfig;
          message.cleanContent = message.content;
          message.channel = mockMessageTextChannelMatchingConfig;
          client.emit('message', message);

          expect(commandHandler.handle).toBeCalledTimes(1);
          expect(commandHandler.handle).toBeCalledWith(message, client);
        });

        it('does not pass to handler outside of a guild text channel', () => {
          message.content = mockMessageContentMatchingConfig;
          message.cleanContent = message.content;
          message.channel = mockMessageTextChannelMatchingConfig;
          message.channel.type = undefined;
          client.emit('message', message);

          expect(commandHandler.handle).not.toBeCalled();
        });

        it('does not pass to handler outside of the configured channel', () => {
          message.content = mockMessageContentMatchingConfig;
          message.cleanContent = message.content;
          message.channel = mockMessageTextChannelNotMatchingConfig;
          client.emit('message', message);

          expect(commandHandler.handle).not.toBeCalled();
        });

        it('does not pass to handler without the configured prefix', () => {
          message.content = mockMessageContentNotMatchingConfig;
          message.cleanContent = message.content;
          message.channel = mockMessageTextChannelMatchingConfig;
          client.emit('message', message);

          expect(commandHandler.handle).not.toBeCalled();
        });
      });
    });
  });

  describe('login', () => {
    it('uses environment variable', () => {
      expect(client.login).toBeCalledTimes(1);
      expect(client.login).toBeCalledWith(mockDiscordApiKey);
    });
  });
});
