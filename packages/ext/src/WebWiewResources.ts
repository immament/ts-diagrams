import * as vscode from 'vscode';

export interface WebWiewResources {
  getWebViewBasePath(): vscode.Uri;
  getWebViewContent(webview: vscode.Webview): string;
}
