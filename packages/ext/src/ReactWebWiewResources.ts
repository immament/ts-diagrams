import {readFileSync} from 'fs';
import * as vscode from 'vscode';
import {WebWiewResources} from './WebWiewResources';

export class ReactWebWiewResources implements WebWiewResources {
  private webViewBasePath: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this.webViewBasePath = vscode.Uri.joinPath(extensionUri, 'dist', 'web');
  }

  getWebViewBasePath() {
    return this.webViewBasePath;
  }

  getWebViewContent(webview: vscode.Webview) {
    const {styleUri, scriptUri} = this.getResources(webview);

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="${styleUri}">
    <meta http-equiv="Content-Security-Policy" 
      content="default-src 'none'; img-src vscode-resource:; 
      script-src ${webview.cspSource} 'nonce-${nonce}';
      font-src data:; style-src vscode-resource: 'nonce-abc';">

		<title>Diagram</title>
    <base href="${webview.asWebviewUri(this.webViewBasePath)}/">
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>    
    <div id="root"></div>
		<script nonce="${nonce}" 
      src="${this.getResourcePath(webview, 'webview-init.js')}">
    </script>
		<script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  private getResources(webview: vscode.Webview) {
    const {mainScript, mainStyle} = this.getResourcesNames();

    return {
      scriptUri: webview.asWebviewUri(mainScript),
      styleUri: webview.asWebviewUri(mainStyle),
    };
  }

  private getResourcePath(webview: vscode.Webview, ...pathSegments: string[]) {
    const pathOnDisk = vscode.Uri.joinPath(
      this.webViewBasePath,
      ...pathSegments
    );
    return webview.asWebviewUri(pathOnDisk);
  }

  private getResourcesNames() {
    const webviewContentDirName = 'content';

    const manifestPath = vscode.Uri.joinPath(
      this.webViewBasePath,
      webviewContentDirName,
      'asset-manifest.json'
    );

    const manifest = this.readJSON(manifestPath.path);

    const mainScript = vscode.Uri.joinPath(
      this.webViewBasePath,
      webviewContentDirName,
      manifest.files['main.js']
    );
    const mainStyle = vscode.Uri.joinPath(
      this.webViewBasePath,
      webviewContentDirName,
      manifest.files['main.css']
    );

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
