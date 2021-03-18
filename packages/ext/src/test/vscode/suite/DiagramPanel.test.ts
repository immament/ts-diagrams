import * as vscode from 'vscode';
import {DiagramPanel} from '../../../DiagramPanel';

const webViewResourcesMock = {
  getWebViewBasePath: () => vscode.Uri.parse(__dirname),
  getWebViewContent: () => `<script>
  const vscode = acquireVsCodeApi();
  window.addEventListener('message', (event) => {
    const message = event.data;
    vscode.postMessage({reply: message});
  });
</script>`,
};

describe('DiagramPanel', () => {
  it('should create diagram panel with webview', done => {
    const panel = new DiagramPanel(
      webViewResourcesMock,
      __dirname + '/__testdata__/',
      '/**/*.ts'
    );

    getMessage(panel.getWebViewPanel()).then(() => done(), done);
  });
});

function getMessage<R = unknown>(webview: vscode.WebviewPanel): Promise<R> {
  return new Promise<R>(resolve => {
    const sub = webview.webview.onDidReceiveMessage(message => {
      sub.dispose();
      resolve(message);
    });
  });
}
