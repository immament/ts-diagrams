import {InMemoryFileSystemHost} from 'ts-morph';
import {ClassDiagramExtractor} from '../ClassDiagramExtractor';

describe('ClassDiagramExtractor', () => {
  test('should ', () => {
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

    const diagram = extractor.extract({directory: 'test'});
    expect(diagram.getElements()).toHaveLength(1);
  });

  test.only('should use real files system', () => {
    const directory = __dirname + '/test_data';
    const extractor = new ClassDiagramExtractor(
      {
        skipLoadingLibFiles: true,
        skipAddingFilesFromTsConfig: true,
      },
      {diagramSrc: directory}
    );

    const diagram = extractor.extract({directory});
    expect(diagram.getElements()).toHaveLength(2);
  });
});
