/* eslint-disable node/no-unsupported-features/node-builtins */
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

  describe('Elements', () => {
    test('should use real files system', done => {
      const directory = __dirname + '/test_data';
      const extractor = new ClassDiagramExtractor(
        {
          //skipLoadingLibFiles: true,
          skipAddingFilesFromTsConfig: true,
          compilerOptions: {
            skipLibCheck: true,
            skipDefaultLibCheck: true,
            //noResolve: true,
            typeRoots: [],
            lib: ['lib.es5.d.ts'],
            //lib: ['es5'],
          },
          // tsConfigFilePath: directory + '/tsconfig.json',
        },
        {includeFilesFromDir: directory}
      );

      const {streams$: diagrams$, close} = extractor.extract({
        directory,
        watchOff: true,
      });

      diagramSubs = diagrams$.subscribe(diagram => {
        expect(diagram.elements).toHaveLength(2);
        expect(diagram.links).toHaveLength(1);
        close();
        done();
      });
    });

    describe('InMemory', () => {
      test('should detect links in one file', done => {
        const host = new InMemoryFileSystemHost();
        host.writeFileSync('tsconfig.json', '{}');
        host.writeFileSync(
          '/test/file.ts',
          `export interface A {}
          export interface B extends A {}
          export function m1(param1: number, param2: string): A {}`
        );
        const extractor = new ClassDiagramExtractor({
          fileSystem: host,
          skipLoadingLibFiles: true,
          tsConfigFilePath: 'tsconfig.json',
          //skipAddingFilesFromTsConfig: true,
        });

        const {streams$: diagrams$, close} = extractor.extract({
          directory: 'test',
          watchOff: true,
        });
        diagramSubs = diagrams$.subscribe(diagram => {
          expect(diagram.elements).toHaveLength(3);
          expect(diagram.links).toHaveLength(2);
          expect(diagram.links[0]).toMatchObject({
            // fromId: '2',
            // toId: '1',
            kind: 'uml.Generalization',
          });
          close();

          done();
        });
      });

      test('should detect links between files', done => {
        const host = new InMemoryFileSystemHost();
        host.writeFileSync('tsconfig.json', '{}');
        host.writeFileSync('/test/fileA.ts', 'export class A {}');
        host.writeFileSync(
          '/test/fileB.ts',
          `import {A} from "./fileA";
        export class B implements A {}`
        );

        const extractor = new ClassDiagramExtractor({
          fileSystem: host,
          skipLoadingLibFiles: true,
          tsConfigFilePath: 'tsconfig.json',
          //skipAddingFilesFromTsConfig: true,
        });

        const {streams$: diagrams$, close} = extractor.extract({
          directory: 'test',
          watchOff: true,
        });

        diagramSubs = diagrams$.subscribe(diagram => {
          expect(diagram.elements).toHaveLength(2);
          expect(diagram.links).toHaveLength(1);
          expect(diagram.links[0]).toMatchObject({
            // fromId: '2',
            // toId: '1',
            kind: 'uml.Generalization',
          });

          close();
          done();
        });
      });

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

        const {streams$: diagrams$, close} = extractor.extract({
          directory: 'test',
          watchOff: true,
        });
        diagramSubs = diagrams$.subscribe(diagram => {
          expect(diagram.elements).toHaveLength(1);

          close();

          done();
        });
      });

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

        const {streams$: diagrams$, close} = extractor.extract({
          directory: 'test',
        });

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

        const {streams$: diagrams$, close} = extractor.extract({
          directory: 'test',
        });

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

        const {streams$: diagrams$, close} = extractor.extract({
          directory: 'test',
        });

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
  });

  afterEach(() => {
    diagramSubs?.unsubscribe();
    diagramSubs = undefined;
    chokidarMock.clearMock();
  });
});
