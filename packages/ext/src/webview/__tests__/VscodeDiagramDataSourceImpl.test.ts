import {DiagramChangedMessage, DiagramElementDTO} from 'common';
import {VscodeDiagramDataSourceImpl} from '../VscodeDiagramDataSource';

describe('VscodeDiagramDataSourceImpl', () => {
  test('should listen diagram messages', done => {
    const dataSource = new VscodeDiagramDataSourceImpl();

    dataSource.dataChanged(d => {
      expect(d?.elements).toHaveLength(1);
      done();
    });

    const message: DiagramChangedMessage = {
      command: 'diagram',
      diagram: {elements: [{} as DiagramElementDTO], links: []},
    };

    global.postMessage(message, '*');
  });

  test('should ignore unknow messages', done => {
    const dataSource = new VscodeDiagramDataSourceImpl();

    dataSource.dataChanged(d => {
      expect(d?.elements).toHaveLength(1);
      done();
    });

    const ignoredMessage1 = {
      command: 'diagram111',
      diagram: {elements: []},
    };

    const ignoredMessage2 = {};

    const message: DiagramChangedMessage = {
      command: 'diagram',
      diagram: {elements: [{} as DiagramElementDTO], links: []},
    };

    global.postMessage(ignoredMessage1, '*');
    global.postMessage(ignoredMessage2, '*');
    global.postMessage(message, '*');
  });
});
