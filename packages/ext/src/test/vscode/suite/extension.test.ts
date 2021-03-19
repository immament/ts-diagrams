// You can import and use all API from the 'vscode' module
// as well as import your extension to test it

import * as vscode from 'vscode';

// import * as myExtension from '../../extension';

describe('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  const disposables: vscode.Disposable[] = [];

  afterEach(async () => {
    await closeAllEditors();
    disposeAll(disposables);
  });

  it('should open diagram from command', done => {
    vscode.commands.executeCommand('diagrams.start').then(() => {
      done();
    }, done);

    expect(1).toBeDefined();
  });

  it('should ....1', () => {
    expect(1).toBeDefined();
  });

  it('should ....2', () => {
    expect(1).toBeDefined();
  });

  describe('Name of the group', () => {
    it('should ....3', () => {
      expect(1).toBeDefined();
    });
    test('should ....4', () => {
      expect(1).toBe(2);
    });
  });

  function disposeAll(disposables: vscode.Disposable[]) {
    vscode.Disposable.from(...disposables).dispose();
  }

  function closeAllEditors() {
    return vscode.commands.executeCommand('workbench.action.closeAllEditors');
  }
});
