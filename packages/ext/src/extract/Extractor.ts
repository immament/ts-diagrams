import {
  ClassDiagram,
  ClassDiagramExtractor,
  ClassElement,
  InMemoryFileSystemHost,
} from 'extractor';

export class Extractor {
  extract() {
    const host = new InMemoryFileSystemHost();
    host.writeFileSync('tsconfig.json', '{}');
    host.writeFileSync(
      '/test/file.ts',
      'export class A {m1(param1: number, param2: string): string {};}'
    );

    host.writeFileSync(
      '/test/file2.ts',
      'export class B {m1(param1: number, param2: string): string {};}'
    );

    host.writeFileSync(
      '/test/file3.ts',
      `export class C {m1(param1: number, param2: string): string {};
      p1: string;
    }`
    );

    const extractor = new ClassDiagramExtractor({
      fileSystem: host,
      skipLoadingLibFiles: true,
      tsConfigFilePath: 'tsconfig.json',
      //skipAddingFilesFromTsConfig: true,
    });

    const diagram = extractor.extract({directory: 'test'});

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
