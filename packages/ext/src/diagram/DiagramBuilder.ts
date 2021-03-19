import {
  ClassDiagram,
  ClassDiagramExtractor,
  ClassElement,
  FileSystemHost,
  InMemoryFileSystemHost,
} from 'extractor';

export class DiagramBuilder {
  create({
    diagramSrc,
    files,
  }: {
    diagramSrc?: string;
    files?: string;
  } = {}) {
    const diagramExtractor = new ClassDiagramExtractor(
      {
        skipLoadingLibFiles: true,
      },
      {diagramSrc, files}
    );

    const diagram = diagramExtractor.extract({directory: diagramSrc});

    return this.convert(diagram);
  }

  createDemo() {
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
      {diagramSrc: '.'}
    );

    const diagram = diagramExtractor.extract({directory: 'test'});

    return this.convert(diagram);
  }

  private convert(diagram: ClassDiagram): DiagramSkeleton {
    return {
      elements: diagram.getElements().map<SkeletonElement>(el => {
        const cel = el as ClassElement;
        return {
          id: cel.kind,
          name: cel.name,
          type: 'uml.Class',
          properties: cel.getProperties().map(p => `${p.name}: ${p.type}`),
          methods: cel.getMethods().map(p => `${p.name}(): ${p.returnType}`),
        };
      }),
      links: [],
    };
  }
}

export interface SkeletonElement {
  id: string;
  type: string;
  name: string;
  properties?: string[];
  methods?: string[];
}

export interface SkeletonLink {
  id?: string;
  fromId: string;
  toId: string;
  type: string;
  name?: string;
}

export interface DiagramSkeleton {
  elements: SkeletonElement[];
  links: SkeletonLink[];
}
