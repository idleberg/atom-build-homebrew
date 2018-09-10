# build-homebrew

[![apm](https://flat.badgen.net/apm/license/build-homebrew)](https://atom.io/packages/build-homebrew)
[![apm](https://flat.badgen.net/apm/v/build-homebrew)](https://atom.io/packages/build-homebrew)
[![apm](https://flat.badgen.net/apm/dl/build-homebrew)](https://atom.io/packages/build-homebrew)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/atom-build-homebrew)](https://circleci.com/gh/idleberg/atom-build-homebrew)
[![David](https://flat.badgen.net/david/dep/idleberg/atom-build-homebrew)](https://david-dm.org/idleberg/atom-build-homebrew)
[![David](https://flat.badgen.net/david/dev/idleberg/atom-build-homebrew)](https://david-dm.org/idleberg/atom-build-homebrew?type=dev)

[Atom Build](https://atombuild.github.io/) provider for Homebrew. Audits, tests and builds Homebrew formulas

## Installation

### apm

Install `build-homebrew` from Atom's [Package Manager](http://flight-manual.atom.io/using-atom/sections/atom-packages/) or the command-line equivalent:

`$ apm install build-homebrew`

### Using Git

Change to your Atom packages directory:

```bash
# Windows
$ cd %USERPROFILE%\.atom\packages

# Linux & macOS
$ cd ~/.atom/packages/
```

Clone repository as `build-homebrew`:

```bash
$ git clone https://github.com/idleberg/atom-build-homebrew build-homebrew
```

Inside the cloned directory, install Node dependencies:

```bash
$ yarn || npm install
```

## Usage

### Build

Before you can build, select an active target with your preferred build option.

Available targets:

- Homebrew Audit: strict
- Homebrew Audit: New Formula
- Homebrew Install: Build from Source
- Homebrew Re-install: Build from Source
- Homebrew Uninstall
- Homebrew Test

### Shortcuts

Here's a reminder of the default shortcuts you can use with this package:

**Select active target**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> or <kbd>F7</kbd>

**Build script**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> or <kbd>F9</kbd>

**Jump to error**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd> or <kbd>F4</kbd>

**Toggle build panel**

<kbd>Super</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd> or <kbd>F8</kbd>

## License

This work is dual-licensed under [The MIT License](https://opensource.org/licenses/MIT) and the [GNU General Public License, version 2.0](https://opensource.org/licenses/GPL-2.0)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/atom-build-homebrew) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`