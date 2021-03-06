import { configSchema, getConfig } from './config';
import { EventEmitter } from 'events';
import { satisfyDependencies } from 'atom-satisfy-dependencies';
import Logger from './log';
import { name } from '../package.json';
import which from 'which';

export { configSchema as config };

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
      if (getConfig('alwaysEligible') === true) {
        Logger.log('Always eligible');
        return true;
      }

      if (which.sync('brew', { nothrow: true })) {
        Logger.log('Build provider is eligible');
        return true;
      }

      Logger.error('Build provider isn\'t eligible');
      return false;
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

export function activate() {
  Logger.log('Activating package');

  // This package depends on build, make sure it's installed
  if (getConfig('manageDependencies') === true) {
    satisfyDependencies(name);
  }
}

export function deactivate() {
  Logger.log('Deactivating package');
}
