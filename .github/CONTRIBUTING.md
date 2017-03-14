# Contributing to myDiabetes

Hi! I’m really excited that you are interested in contributing to myDiabetes. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

* [Communication channels](#communication)
* [Team members](#team)
* [Issue tracker](#issues)
* [Pull requests](#pull-requests)
* [Versioning](#versioning)
* [License](#license)

<a name="communication"></a>
## Communication channels

Before you get lost in the repository, here are a few starting points
for you to check out. You might find that others have had similar
questions or that your question rather belongs in one place than another.

* To be added

## Team members

myDiabetes is developed as an open source project by [the Reactive Team (aka Prototype Studios)](http://prototypestd.cu.ma/)
in Kuala Lumpur, Malaysia. The core maintainers you will encounter in this project
are all part of the Reactive Team.

## Issue Reporting Guidelines

- The issue list of this repo is **exclusively** for bug reports and feature requests. Non-conforming issues will be closed immediately.

  - For simple beginner questions, you can get quick answers from [The Gitter chat room](#).

- Try to search for your issue, it may have already been answered or even fixed in the development branch.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

- A good bug report should isolate specific methods that exhibit unexpected behavior and precisely define how expectations were violated. What did you expect the it to do, and how did the observed behavior differ? The more precisely you isolate the issue, the faster we can investigate.

- Issues with no clear repro steps will not be triaged. If an issue labeled "need repro" receives no further input from the issue author for more than 5 days, it will be closed.

- If your issue is resolved but still open, don’t hesitate to close it. In case you found a solution by yourself, it could be helpful to explain how you fixed it.

- Most importantly, we beg your patience: the team must balance your request against many other responsibilities — fixing other bugs, answering other questions, new features, new documentation, etc. The issue list is not paid support and we cannot make guarantees about how fast your issue can be resolved.

## Pull Request Guidelines

- The `master` branch is basically just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Checkout a topic branch from the relevant branch, e.g. `develop`, and merge back against that branch.

- It's OK to have multiple small commits as you work on the PR - we will let GitHub automatically squash it before merging.

- If adding new feature:
  - Add accompanying test case.
  - Provide convincing reason to add this feature. Ideally you should open a suggestion issue first and have it greenlighted before working on it.

- If fixing a bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

## Versioning

myDiabetes is maintained by using the [Semantic Versioning Specification (SemVer)](http://semver.org).

<a name="license"></a>
## License

By contributing your code, you agree to license your contribution under the MIT License