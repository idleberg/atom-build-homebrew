'use babel';

import { EventEmitter } from 'events';
import { spawnSync } from 'child_process';
import { platform } from 'os';

// Package settings
import meta from '../package.json';

let prefix;
if (platform() === 'win32') {
  prefix = '/';
} else {
  prefix = '-';
}

export const config = {
  manageDependencies: {
    title: 'Manage Dependencies',
    description: 'When enabled, third-party dependencies will be installed automatically',
    type: 'boolean',
    default: true,
    order: 1
  },
  alwaysEligible: {
    title: 'Always Eligible',
    description: 'The build provider will be available in your project, even when not eligible',
    type: 'boolean',
    default: false,
    order: 2
  }
};

export function satisfyDependencies() {
  let k;
  let v;

  require('atom-package-deps').install(meta.name);

  const ref = meta['package-deps'];
  const results = [];

  for (k in ref) {
    if (typeof ref !== 'undefined' && ref !== null) {
      v = ref[k];
      if (atom.packages.isPackageDisabled(v)) {
        if (atom.inDevMode()) {
          console.log('Enabling package \'' + v + '\'');
        }
        results.push(atom.packages.enablePackage(v));
      } else {
        results.push(void 0);
      }
    }
  }
  return results;
}

export function which() {
  if (platform() === 'win32') {
    return 'where';
  }

  return 'which';
}

export function provideBuilder() {
  return class HomebrewProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Homebrew';
    }

    isEligible() {
      if (atom.config.get(meta.name + '.alwaysEligible') === true) {
        return true;
      }

      const cmd = spawnSync(which(), ['brew']);
      if (!cmd.stdout.toString()) {
        return false;
      }

      return true;
    }

    settings() {
      const auditMatch = [
        '(?<file>.+): \\* C: (?<line>\\d+): col (?<col>\\d+): (?<message>.+)'
      ];

      return [
        {
          name: 'Homebrew Audit: strict',
          exec: 'brew',
          args: [ 'audit', '--strict', '--display-filename', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'alt-cmd-b',
          atomCommandName: 'build-homebrew:audit-strict',
          errorMatch: auditMatch
        },
        {
          name: 'Homebrew Audit: New Formula',
          exec: 'brew',
          args: [ 'audit', '--new-formula', '--display-filename', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'build-homebrew:audit-new-formula',
          errorMatch: auditMatch
        },
        {
          name: 'Homebrew Install: Build from Source',
          exec: 'brew',
          args: [ 'install', '--build-form-source', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'build-homebrew:install'
        },
        {
          name: 'Homebrew Re-install: Build from Source',
          exec: 'brew',
          args: [ 'reinstall', '--build-form-source', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'build-homebrew:reinstall'
        },
        {
          name: 'Homebrew Uninstall',
          exec: 'brew',
          args: [ 'uninstall', '{FILE_ACTIVE_NAME_BASE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          atomCommandName: 'build-homebrew:uninstall'
        },
        {
          name: 'Homebrew Test',
          exec: 'brew',
          args: [ 'uninstall', '{FILE_ACTIVE_NAME_BASE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'alt-cmd-t',
          atomCommandName: 'build-homebrew:test'
        }
      ];
    }
  };
}

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get(meta.name + '.manageDependencies') === true) {
    satisfyDependencies();
  }
}
