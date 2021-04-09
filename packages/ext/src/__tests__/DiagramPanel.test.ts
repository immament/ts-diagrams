/// <reference types="../__mocks__/vscode" />
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {currentSubject} from 'extractor';
import {DiagramPanel} from '../DiagramPanel';
import {WebWiewResourcesMock} from '../__mocks__/WebViewResourcesMock';

describe('DiagramPanel', () => {
  test('should ', done => {
    const diagramPanel = new DiagramPanel(new WebWiewResourcesMock());

    const webviewPanel = diagramPanel.getWebViewPanel();

    webviewPanel.webview.waitMessage(() => {
      webviewPanel.dispose();
      done();
    });

    currentSubject.next({
      elements: [
        {id: '1', kind: 'uml.Class', name: 'A'},
        {id: '2', kind: 'uml.Class', name: 'C'},
        {id: '3', kind: 'uml.Class', name: 'B'},
      ],
      links: [],
    });
  });
});
