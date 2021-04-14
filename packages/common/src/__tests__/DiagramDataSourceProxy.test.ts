import {ClassDiagramDTO} from '..';
import {DiagramDataSource} from '../DiagramDataSource';
import {DiagramDataSourceProxy} from '../DiagramDataSourceProxy';
import {MockDiagramDataSource} from './DiagramDataSourceMock';

const flushPromises = () => new Promise(setImmediate);

describe('DiagramDataSourceProxy', () => {
  let mockDataSource: MockDiagramDataSource;
  beforeEach(() => {
    mockDataSource = new MockDiagramDataSource();
  });

  test('should notify ', done => {
    const proxy = new DiagramDataSourceProxy(Promise.resolve(mockDataSource));

    const testDiagramData = {} as ClassDiagramDTO;

    proxy.dataChanged(diagram => {
      expect(diagram).toBe(testDiagramData);
      done();
    });

    flushPromises().then(() => {
      mockDataSource.notifyDataChanged(testDiagramData);
    });
  });

  test('should notify if dataSource resolved after dataChanged listen', done => {
    let resolve: (ds: DiagramDataSource) => void;
    const promise = new Promise<DiagramDataSource>(res => {
      resolve = res;
    });

    const proxy = new DiagramDataSourceProxy(promise);

    const testDiagramData = {} as ClassDiagramDTO;

    proxy.dataChanged(diagram => {
      expect(diagram).toBe(testDiagramData);
      done();
    });

    flushPromises().then(() => {
      resolve(mockDataSource);

      flushPromises().then(() => {
        mockDataSource.notifyDataChanged(testDiagramData);
      });
    });
  });
});
