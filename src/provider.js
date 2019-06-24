'use babel';

import { EventEmitter } from 'events';
import { install } from 'atom-package-deps';
import { spawn } from 'child_process';
import { platform } from 'os';

// Package settings
import meta from '../package.json';

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
  install(meta.name);

  const packageDeps = meta['package-deps'];

  packageDeps.forEach( packageDep => {
    if (packageDep) {
      if (atom.packages.isPackageDisabled(packageDep)) {
        if (atom.inDevMode()) console.log(`Enabling package '${packageDep}\'`);
        atom.packages.enablePackage(packageDep);
      }
    }
  });
}

function spawnPromise(cmd, args) {
  return new Promise(function (resolve, reject) {
    const child = spawn(cmd, args);
    let stdOut;
    let stdErr;

    child.stdout.on('data', function (line) {
      stdOut += line.toString().trim();
    });

    child.stderr.on('data', function (line) {
      stdErr += line.toString().trim();
    });

    child.on('close', function (code) {
      if (code === 0) {
        resolve(stdOut);
      }

      reject(stdErr);
    });
  });
}

export function which() {
  return (platform() === 'win32') ? 'where' : 'which';
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

    async isEligible() {
      if (atom.config.get(`${meta.name}.alwaysEligible`) === true) {
        return true;
      }

      const cmd = await spawnPromise(which(), ['brew']);
      if (cmd.stdout && cmd.stdout.toString()) {
        return true;
      }

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

// This package depends on build, make sure it's installed
export function activate() {
  if (atom.config.get(`${meta.name}.manageDependencies`) === true) {
    satisfyDependencies();
  }
}
