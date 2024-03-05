# Contributing to the Project

This document outlines the guidelines for contributing to the project.

## Table of Contents

1. [Branching Rules](#branching-rules)
    - [Types](#types-of-branch)
    - [Examples](#examples-of-branches)
2. [Commit Message Guidelines](#commit-message-guidelines)
    - [Types](#types-of-commit)
    - [Examples](#examples-of-commit-messages)
3. [Pull Requests](#pull-requests)
    - [For Team Members](#for-team-members)
    - [For External Contributors](#for-external-contributors)

## Branching Rules

Branch names should be descriptive, reflecting the purpose of the changes, following the format below.

- Format: `<type>/<issue_number>-<brief_description>`

_Note: `<issue_number>-` can be omitted if the modification is not based on an issue._

### Types of Branch

- `main`:

    - **Purpose**: For production use.
    - **Rule**: Direct commits are restricted. Changes arrive via pull requests from `develop` or `hotfix/` branches.
  
- `develop`:
  
  - **Purpose**: For development use.
  - **Rule**: Direct commits are restricted. Changes arrive via pull requests from `feature/`, `hotfix/`, or `docs/` branches.

- `feature/`:

    - **Purpose**: Branches for developing new features or improvements.
    - **Rule**: After completion and testing, submit a pull request to merge into `main`.

- `hotfix/`:

    - **Purpose**: Branches for urgent fixes.
    - **Rule**: After fixing, submit a pull request to merge into `main`.

- `docs/`:
    - **Purpose**: Branches for documentation updates.
    - **Rule**: Submit a pull request to merge updates into `main`.

### Examples of Branches

- feature/42-user-authentication
- hotfix/56-security-vulnerability-fix
- docs/108-update-installation-guide

## Commit Message Guidelines

This project follows a following conventional commit message format.

- Format: `type(optional scope): description`
- We kindly ask you to write the `description` with a lowercase letter.

### Types of Commit

- `feat`: New features or additions
- `fix`: Bug fixes
- `docs`: Changes to documentation
- `style`: Code style changes (formatting, missing semi colons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples of Commit Messages

- Bad: `Made changes to login`
- Good examples:
    - `feat: introduce user profiles`
    - `fix: resolve memory leak in user sessions`
    - `docs(api): enhance API endpoint documentation`
    - `style(widgets): adjust widget styling for consistency`
    - `refactor: improve query efficiency`
    - `test: cover user deletion scenarios`
    - `chore: upgrade to webpack 5`

If you are interested in the detailed specification you can visit:

- [Conventional Commits](https://www.conventionalcommits.org/)
- [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#commitlintconfig-conventional)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

## Pull Requests

When merging pull requests into the `main` branch, we use the "squash and merge" strategy. This approach combines all commits from the branch into a single commit in the `main` branch, ensuring our commit history remains clean and easy to follow.

### For Team Members:

1. Create a new branch from the `main` branch.
2. Follow the [Branch Rules](#branching-rules) while naming your branch.
3. Work on your changes locally.
4. Commit your changes, ensuring to follow the project's [commit message guidelines](#commit-message-guidelines).
5. Push your branch to the repository.
6. Create a Pull Request against the original branch you branched from.
7. Await code review, and address any comments as necessary.

### For External Contributors:

1. Fork the repository to your own GitHub account.
2. Clone your forked repository locally.
3. Create a new branch from the `main` branch on your fork.
4. Follow the [Branching Rules](#branching-rules) while naming your branch.
5. Work on your changes locally.
6. Commit your changes, ensuring to follow the project's [commit message guidelines](#commit-message-guidelines).
7. Push your branch to your forked repository.
8. Create a Pull Request against the `main` branch of the original repository.
9. Await code review, and address any comments as necessary.