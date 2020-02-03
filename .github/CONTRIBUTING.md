# Fix My Rights Contributing Guide

Hi! We're really excited that you are interested in contributing to the Fix My Rights community. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](https://github.com/fixmyrights/discord-bot/blob/master/.github/CODE_OF_CONDUCT.md)
- [Pull Request Guidelines](#pull-request-guidelines)

## Pull Request Guidelines

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- Make sure `npm test` passes.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR.
  - Add appropriate test coverage if applicable.
  
- Only Issue a Pull Request once you feel like your work on that branch is done. It will be deleted after the merge.

- Try keeping a particular feature encased withing a single Branch, that way it makes it easier to track if needed. 
