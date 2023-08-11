# Contributing to the *gcix*

Thank you for considering contributing to the *gcix*! This document outlines the guidelines for contributing to our project. By participating, you agree to abide by these guidelines.

## How Can I Contribute?

### Reporting Bugs

If you find a bug in the project, please create an issue on our [issue tracker](https://gitlab.com/gcix/gcix/-/issues/new) with a clear description of the bug. Include relevant details such as the steps to reproduce and the expected vs. actual behavior.

### Suggesting Enhancements

To suggest an enhancement, create an issue on our [issue tracker](https://gitlab.com/gcix/gcix/-/issues/new) with a clear description of your proposed improvement. We welcome new ideas and feedback!

### Code Contributions

We welcome code contributions to improve the *gcix*. Please follow the [Coding Guidelines](#coding-guidelines) below.

### Documentation

Help improve our documentation by fixing typos, adding examples, or clarifying explanations. If you notice anything that needs improvement, submit a pull request.

### Testing

Help us improve the project's quality by writing and running tests. If you're adding new features or fixing bugs, consider adding relevant tests.

## Getting Started

To get started contributing to the *gcix*, follow these steps:

### Fork the Repository

Fork the [gcix](https://gitlab.com/gcix/gcix/-/forks/new) to your GitLab account
by clicking the "Fork" button.

### Install Dependencies

Navigate to the project directory and install dependencies:

* You need to have [NodeJS](https://nodejs.org/de/download) already installed.
* Ensure you have `npx` installed.

```sh
cd your-forked-repo
# This will install and execute projen
npx projen
```

### Make Changes

Make your changes and improvements in your local repository.

### Run Tests

Run tests to ensure your changes haven't broken anything:

```sh
npx projen test:update # ensures that the comparison files are updated
```

## Coding Guidelines

* Write clear, concise, and well-documented code.
* Write unit tests for your code.

## Commit Guidelines

* Commit messages should be descriptive and follow the conventional commit format. See [Conventional Commits](https://www.conventionalcommits.org/).

## Merge Requests

When you're ready to submit your changes, follow these steps:

1. Push your changes to your forked repository.
2. Create a pull request against the main repository's `main` branch.
3. Provide a clear title and description for your pull request, referencing any relevant issues.
4. A project maintainer will review your pull request and provide feedback.

## Code of Conduct

Please review and adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) while participating in this project.

## License

By contributing to the *gcix*, you agree that your contributions will be licensed under the [Apache License 2.0](./LICENSE).

---

Thank you for contributing to the *gcix*!
