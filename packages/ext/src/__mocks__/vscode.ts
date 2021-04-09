export const window = {
  createWebviewPanel: () => {
    let postMessageListener: () => void | undefined;
    let onDidDisposeCb: () => void | undefined;

    const panel = {
      webview: {
        waitMessage: (cb: () => void) => {
          postMessageListener = cb;
        },
        postMessage: jest.fn().mockImplementation(() => {
          postMessageListener?.();
        }),
      },
      onDidDispose: (cb: () => void) => {
        onDidDisposeCb = cb;
      },
      dispose: () => {
        onDidDisposeCb?.();
      },
    };

    return panel;
  },
};

export const workspace = {
  getConfiguration: jest.fn(),
  workspaceFolders: [],
  onDidSaveTextDocument: jest.fn(),
};

export const Uri = {
  file: (f: unknown) => f,
  parse: jest.fn(),
};

export const commands = {
  executeCommand: jest.fn(),
};

export enum ViewColumn {
  Active = -1,
  Beside = -2,
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,

  Nine = 9,
}

export class Disposable {
  constructor(private disposableCb: () => void) {}

  dispose() {
    this.disposableCb();
  }
}
