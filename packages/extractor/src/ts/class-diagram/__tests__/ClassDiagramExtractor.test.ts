import * as chokidar from 'chokidar';
import {Subscription} from 'rxjs';
import {EventType} from 'src/ts/TsProjectWatcher';
import {InMemoryFileSystemHost} from 'ts-morph';
import {ClassDiagramExtractor} from '../ClassDiagramExtractor';

const chokidarMock = (chokidar as unknown) as {
  raise: (eventName: EventType, path: string) => void;
  clearMock: () => void;
};

describe('ClassDiagramExtractor', () => {
  let diagramSubs: Subscription | undefined;

  test('should use in memory file system', done => {
    const host = new InMemoryFileSystemHost();
    host.writeFileSync('tsconfig.json', '{}');
    host.writeFileSync(
      '/test/file.ts',
      'export function m1(param1: number, param2: string): string {};'
    );
    const extractor = new ClassDiagramExtractor({
      fileSystem: host,
      skipLoadingLibFiles: true,
      tsConfigFilePath: 'tsconfig.json',
      //skipAddingFilesFromTsConfig: true,
    });

    const {diagrams$, close} = extractor.extract({
      directory: 'test',
      watchOff: true,
    });
    diagramSubs = diagrams$.subscribe(diagram => {
      expect(diagram.elements).toHaveLength(1);

      close();

      done();
    });
  });

  test('should use real files system', done => {
    const directory = __dirname + '/test_data';
    const extractor = new ClassDiagramExtractor(
      {
        skipLoadingLibFiles: true,
        skipAddingFilesFromTsConfig: true,
      },
      {includeFilesFromDir: directory}
    );

    const {diagrams$, close} = extractor.extract({directory, watchOff: true});

    diagramSubs = diagrams$.subscribe(diagram => {
      expect(diagram.elements).toHaveLength(2);
      close();
      done();
    });
  });

  describe('InMemory', () => {
    test('watch file changed', done => {
      const host = new InMemoryFileSystemHost();
      host.writeFileSync('tsconfig.json', '{}');
      host.writeFileSync(
        '/test/file.ts',
        'export function m1(param1: number, param2: string): string {};'
      );

      const extractor = new ClassDiagramExtractor({
        fileSystem: host,
        skipLoadingLibFiles: true,
        tsConfigFilePath: 'tsconfig.json',
        //skipAddingFilesFromTsConfig: true,
      });

      const {diagrams$, close} = extractor.extract({directory: 'test'});

      let counter = 0;
      diagramSubs = diagrams$.subscribe(diagram => {
        if (counter++ === 0) {
          expect(diagram.elements).toHaveLength(1);
          host.writeFileSync(
            '/test/file.ts',
            'export function m1() {}; export function m2() {};'
          );
          chokidarMock.raise('change', '/test/file.ts');
        } else {
          expect(diagram.elements).toHaveLength(2);
          close();
          done();
        }
      });
    });

    test('watch new file', done => {
      const host = new InMemoryFileSystemHost();
      host.writeFileSync('tsconfig.json', '{}');

      const extractor = new ClassDiagramExtractor({
        fileSystem: host,
        skipLoadingLibFiles: true,
        tsConfigFilePath: 'tsconfig.json',
        //skipAddingFilesFromTsConfig: true,
      });

      const {diagrams$, close} = extractor.extract({directory: 'test'});

      let counter = 0;
      diagramSubs = diagrams$.subscribe(diagram => {
        if (counter++ === 0) {
          expect(diagram.elements).toHaveLength(0);
          host.writeFileSync(
            '/test/file.ts',
            'export function m1() {}; export function m2() {};'
          );
          chokidarMock.raise('add', '/test/file.ts');
        } else {
          expect(diagram.elements).toHaveLength(2);
          close();
          done();
        }
      });
    });

    test('watch file deleted', done => {
      const host = new InMemoryFileSystemHost();
      host.writeFileSync('tsconfig.json', '{}');
      host.writeFileSync(
        '/test/file.ts',
        'export function m1(param1: number, param2: string): string {};'
      );

      const extractor = new ClassDiagramExtractor({
        fileSystem: host,
        skipLoadingLibFiles: true,
        tsConfigFilePath: 'tsconfig.json',
        //skipAddingFilesFromTsConfig: true,
      });

      const {diagrams$, close} = extractor.extract({directory: 'test'});

      let counter = 0;
      diagramSubs = diagrams$.subscribe(diagram => {
        if (counter++ === 0) {
          expect(diagram.elements).toHaveLength(1);
          host.deleteSync('/test/file.ts');
          chokidarMock.raise('unlink', '/test/file.ts');
        } else {
          expect(diagram.elements).toHaveLength(0);
          close();
          done();
        }
      });
    });
  });

  afterEach(() => {
    diagramSubs?.unsubscribe();
    diagramSubs = undefined;
    chokidarMock.clearMock();
  });
});
