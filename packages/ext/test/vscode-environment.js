/* eslint-disable node/no-missing-require */
/* eslint-disable node/no-extraneous-require */
const NodeEnvironment = require('jest-environment-node');
const vscode = require('vscode');

class VsCodeEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    this.global.vscode = vscode;
  }

  async teardown() {
    this.global.vscode = {};
    await super.teardown();
  }
}

module.exports = VsCodeEnvironment;
