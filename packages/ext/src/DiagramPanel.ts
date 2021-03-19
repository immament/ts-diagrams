import * as vscode from 'vscode';
import {DiagramBuilder} from './diagram/DiagramBuilder';
import {WebWiewResources} from './WebWiewResources';

export class DiagramPanel {
  public test?: string;
  private panel: vscode.WebviewPanel;

  private disposables: vscode.Disposable[] = [];

  constructor(
    private resources: WebWiewResources,
    private diagramSrc?: string,
    files?: string
  ) {
    this.panel = this.createWebviewPanel();
    this.panel.webview.html = this.tryGetWebViewContent();
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.createDiagram(diagramSrc, files);
    if (diagramSrc) this.disposables.push(this.watch(diagramSrc, files));
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

  watch(path?: string, files?: string): vscode.Disposable {
    const fileSystemWatcher = vscode.workspace.createFileSystemWatcher(
      path + (files ?? '/**/*.ts')
    );
    fileSystemWatcher.onDidChange(() => this.onResourceChange());
    fileSystemWatcher.onDidCreate(() => this.onResourceChange());
    fileSystemWatcher.onDidDelete(() => this.onResourceChange());
    return fileSystemWatcher;
  }

  private onResourceChange() {
    this.createDiagram(this.diagramSrc);
  }

  private createDiagram(diagramSrc?: string, files?: string) {
    const builder = new DiagramBuilder();
    const diagram = builder.create({diagramSrc, files});
    this.panel.webview.postMessage({command: 'diagram', diagram});
    //setTimeout(() => this.panel.webview.postMessage({command: 'second'}), 2000);
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
}
