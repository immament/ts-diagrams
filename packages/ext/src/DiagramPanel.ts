import {readFileSync} from 'fs';
import * as vscode from 'vscode';
import {Extractor} from './extract/Extractor';

export class DiagramPanel {
  private panel: vscode.WebviewPanel;
  private basePath: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  constructor(extensionUri: vscode.Uri) {
    this.basePath = vscode.Uri.joinPath(extensionUri, 'dist', 'web');
    this.panel = this.createWebview();
    this.panel.webview.html = this.tryGetWebviewContent();
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.createDiagram();
  }

  private tryGetWebviewContent() {
    try {
      return this.getWebviewContent();
    } catch (error) {
      console.error('getWebviewContent', error);
      throw error;
    }
  }

  private createDiagram() {
    console.log('aaaa');
    const extractor = new Extractor();

    const diagram = extractor.extract();

    this.panel.webview.postMessage({command: 'diagram', diagram});
    //setTimeout(() => this.panel.webview.postMessage({command: 'second'}), 2000);
  }

  private createWebview() {
    return vscode.window.createWebviewPanel(
      'diagram',
      'Diagram',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [this.basePath],
      }
    );
  }

  public dispose() {
    this.panel?.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private getWebviewContent() {
    const {styleUri, scriptUri} = this.getResources();

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="${styleUri}">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">

		<title>Diagram</title>
    <base href="${this.panel.webview.asWebviewUri(this.basePath)}/">
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>    
    <div id="root"></div>
		<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  private getResources() {
    const {mainScript, mainStyle} = this.getResourcesNames();

    const scriptUri = this.getResourcePath(mainScript);
    const styleUri = this.getResourcePath(mainStyle);

    return {styleUri, scriptUri};
  }

  private getResourcePath(resource: string) {
    const pathOnDisk = vscode.Uri.joinPath(this.basePath, resource);
    return this.panel.webview.asWebviewUri(pathOnDisk);
  }

  private getResourcesNames() {
    const manifestPath = vscode.Uri.joinPath(
      this.basePath,
      'asset-manifest.json'
    );

    const manifest = this.readJSON(manifestPath.path);
    const mainScript: string = manifest.files['main.js'];
    const mainStyle: string = manifest.files['main.css'];
    return {mainScript, mainStyle};
  }

  private readJSON(filePath: string) {
    const jsonString = readFileSync(filePath, {encoding: 'utf8'});
    return JSON.parse(jsonString);
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}