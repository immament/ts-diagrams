import {
  ClassDiagramExtractor,
  FileSystemHost,
  InMemoryFileSystemHost,
} from 'extractor';
import {DiagramBuilder} from './DiagramBuilder';

export class DiagramBuilderDemo implements DiagramBuilder {
  create() {
    const host: FileSystemHost = new InMemoryFileSystemHost();
    host.writeFileSync('tsconfig.json', '{}');
    host.writeFileSync(
      '/test/file.ts',
      'export class A {m1(param1: number, param2: string): string {};}'
    );

    host.writeFileSync(
      '/test/dir/file2.ts',
      'export class B {m1(param1: number, param2: string): string {};}'
    );

    host.writeFileSync(
      '/test/file3.ts',
      `export class C {m1(param1: number, param2: string): string {};
      p1: string;
    }`
    );

    const diagramExtractor = new ClassDiagramExtractor(
      {
        fileSystem: host,
        skipLoadingLibFiles: true,
        tsConfigFilePath: 'tsconfig.json',
        //skipAddingFilesFromTsConfig: true,
      },
      {includeFilesFromDir: '.'}
    );

    return diagramExtractor.extract({directory: 'test'});
  }
}
