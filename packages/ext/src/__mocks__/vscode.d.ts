declare module 'vscode' {
  export interface Webview {
    waitMessage: (cb: () => void) => void;
  }
}
