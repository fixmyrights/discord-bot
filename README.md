<p align="center">
  <img src="https://raw.githubusercontent.com/fixmyrights/discord-bot/master/.github/logo.png" width="200px" alt=""/>
</p>

<hr>

# Discord Bot

![GitHub top language](https://img.shields.io/github/languages/top/fixmyrights/discord-bot)
![License](https://img.shields.io/github/license/fixmyrights/discord-bot)
![GitHub package.json version](https://img.shields.io/github/package-json/v/fixmyrights/discord-bot)
[![CircleCI](https://img.shields.io/circleci/build/github/fixmyrights/discord-bot)](https://circleci.com/gh/fixmyrights/discord-bot)
![Coveralls github branch](https://img.shields.io/coveralls/github/fixmyrights/discord-bot/master)

## Features

- Right to Repair bill tracking and notifications (via the Legiscan API).

## Preview

![Preview](.github/preview.png)

## Available Commands

| Command                      |                    Description                     |
| ---------------------------- | :------------------------------------------------: |
| !ping                        |         Do you really need an explanation?         |
| !help                        | Provides a list of available commands to the user. |
| !bill scan [state]           |   Queries the API for all bills from that state.   |
| !bill list                   |        Show bills being watched for updates        |
| !bill ignore [state][bill #] |             Remove bill from watchlist             |
| !config [key][value]         |                  Change settings                   |

## Development

### Requirements

- Node.js 'Erbium' (LTS)

### Developing

1. `npm install` or `npm i`
2. `cp .env.template .env`
3. Then edit your `.env` file with the right informations.
4. `npm start`
5. Happy coding 🎉🙌

### Available Tasks

| Task                     |                                            Description                                             |
| ------------------------ | :------------------------------------------------------------------------------------------------: |
| `npm run debug`          |                  Launches [ndb](https://github.com/GoogleChromeLabs/ndb) for you.                  |
| `npm start`              |                                          Starts the bot.                                           |
| `npm run lint`           | Lints the code-base with [ESLint](https://eslint.org/) (but doesn't fix linter complaints for you) |
| `npm run lint:fix`       |                             Lints and tries to fix complaints for you.                             |
| `npm run lint:conflicts` |                               Checks for Prettier/ESLint conflicts.                                |
| `npm run fmt`            |                  Re-formats the code-base using [Prettier](https://prettier.io/).                  |
| `npm run fmt:check`      |                        (CI) Checks if some source files need reformatting.                         |
| `npm run fix`            |                            Runs both formatter and linters. Kowabunga!                             |
| `npm test`               |                        Runs the [Jest](https://jestjs.io/) unit test suite.                        |
| `npm run test:clear`     |                              Clears [Jest](https://jestjs.io/) cache.                              |
| `npm run test:watch`     |                       Same as `npm run test` but with the `--watch-` option.                       |
| `npm run test:e2e`       |                     Runs the [Jest](https://jestjs.io/) end-to-end test suite.                     |

### Conventions

| Convention                                      | Scope      |
| ----------------------------------------------- | ---------- |
| [StandardJS](https://standardjs.com/rules.html) | ECMAScript |

### Frequently Asked Questions

#### Why ECMAScript and not [my-favorite-language]?

That's a good question! Initially, the proof of concept was written in [Rust](https://www.rust-lang.org/) by [Yugo](https://github.com/x47188) & [joaodforce](https://github.com/joaodforce), while Rust is an incredible c-speed and memory-safe language it was not a highly accessible one. To maximize the chance of getting contributions from the community, one of the many existing projects was promoted and ECMAScript was chosen.

#### Can I skip the annoying pre-commit hook?

We use [Husky](https://github.com/typicode/husky) to run a hook at commit.
If you want to skip it add a `--no-verify` to your `git commit`.

## Contribution

Please make sure to read the [Contributing Guide](https://github.com/fixmyrights/discord-bot/blob/master/.github/CONTRIBUTING.md) before making a pull request.

Thank you to [all the people](https://github.com/fixmyrights/discord-bot/graphs/contributors) who already contributed to this project!

<a href="https://github.com/fixmyrights/discord-bot/graphs/contributors"><img src=".github/contributors.png" width="181px" alt=""/></a>

## Acknowledgements

- [@finnbear](https://www.gitlab.com/finnbear) as the initial founder of this project.
- Sean Bolt from [LegiScan, LLC](https://legiscan.com/) for his precious help.

## License

This project is licensed under [BSD 2-Clause](https://spdx.org/licenses/BSD-2-Clause.html).
