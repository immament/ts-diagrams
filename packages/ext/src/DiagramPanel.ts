import * as vscode from 'vscode';
import {DiagramBuilderImpl} from './diagram/DiagramBuilder';
import {WebWiewResources} from './WebWiewResources';

export class DiagramPanel {
  private panel: vscode.WebviewPanel;

  private disposables: vscode.Disposable[] = [];

  constructor(
    private resources: WebWiewResources,
    private diagramSrc?: string,
    files?: string
  ) {
    this.panel = this.createWebviewPanel();
    this.panel.webview.html = this.tryGetWebViewContent();
    this.panel.onDidDispose(() => this.dispose());
    this.createDiagram(diagramSrc, files);
  }

  getWebViewPanel() {
    return this.panel;
  }

  private tryGetWebViewContent() {
    try {
      return this.resources.getWebViewContent(this.panel.webview);
    } catch (error) {
      console.error('getWebviewContent', error);
      throw error;
    }
  }

  private createWebviewPanel() {
    return vscode.window.createWebviewPanel(
      'diagram',
      'Diagram',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [this.resources.getWebViewBasePath()],
      }
    );
  }

  private createDiagram(diagramSrc?: string, files?: string) {
    const builder = new DiagramBuilderImpl();
    const diagramStream = builder.create({diagramSrc, files});

    const subs = diagramStream.streams$.subscribe(diagram => {
      console.log('postMessage', diagram);
      this.panel.webview.postMessage({command: 'diagram', diagram});
    });

    this.disposables.push(new vscode.Disposable(() => subs.unsubscribe()));
  }

  dispose() {
    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
  }
}
