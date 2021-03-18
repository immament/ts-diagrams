import * as vscode from 'vscode';
import {DiagramPanel} from './DiagramPanel';
import {ReactWebWiewResources} from './WebWiewResources';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "diagrams" is now active!');

  const resources = new ReactWebWiewResources(context.extensionUri);

  const disposable = vscode.commands.registerCommand(
    'diagrams.start',
    (arg: vscode.Uri) => {
      new DiagramPanel(resources, arg?.fsPath);
    }
  );

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand('diagrams.doRefactor', () => {})
  );
}

export function deactivate() {}
