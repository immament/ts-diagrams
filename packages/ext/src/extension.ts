import * as vscode from 'vscode';
import {DiagramPanel} from './DiagramPanel';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "diagrams" is now active!');

  const disposable = vscode.commands.registerCommand('diagrams.start', () => {
    new DiagramPanel(context.extensionUri);
  });

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    vscode.commands.registerCommand('diagrams.doRefactor', () => {})
  );
}

export function deactivate() {}
