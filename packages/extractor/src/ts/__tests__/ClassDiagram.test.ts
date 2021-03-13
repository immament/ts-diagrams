import {SourceFile} from 'ts-morph';
import {ClassDiagram} from '../../result/ClassDiagram';
import {ClassDiagramBuilder} from '../ClassDiagramBuilder';
import {Searcher} from '../searcher';
import {initProject, initProjectWithFiles} from './initProject';

describe('ClassDiagram Classes', () => {
  let builder: ClassDiagramBuilder;
  beforeEach(() => {
    builder = new ClassDiagramBuilder();
  });

  test('should create diagram with class elements', () => {
    const diagram = createDiagram('export class A {}');
    expect(diagram.getElements()).toHaveLength(1);
  });

  test('should create diagram with class elements', () => {
    const diagram = createDiagram('export class A {}');
    expect(diagram.getElements()).toHaveLength(1);
  });

  test('should class elements contains methods, properties, accessors', () => {
    const diagram = createDiagram(`export class A {
      p1 = "val";
      get acc1() { return 11; }
      m1() { return 'a'}
    }`);

    const element = diagram.getElements()[0];
    expect(element.getMethods()).toHaveLength(1);
    expect(element.getProperties()).toHaveLength(1);
    expect(element.getAccessors()).toHaveLength(1);
  });

  describe('Methods', () => {
    test('should returns full method signature', () => {
      const diagram = createDiagram(`export class A {
        m1(param1: number, param2: string[] ) { return 'a'}
      }`);

      const method = getFirstMethod(diagram);
      expect(method).toMatchObject({
        name: 'm1',
        returnType: 'string',
        parameters: [
          {name: 'param1', type: 'number'},
          {name: 'param2', type: 'string[]'},
        ],
      });
    });

    test('should returned type contain advanced types', () => {
      const diagram = createDiagram(`
      export class A {
        m1(): B|A|number| {a: string, b: B} & {c: number} { return undefined}
      }
      class B {}`);

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual(
        'number | B | A | ({ a: string; b: B; } & { c: number; })'
      );
    });

    test('should parameter type contain advanced types', () => {
      const diagram = createDiagram(`
      export class A {
        m1(p: B|A|number| {a: string, b: B} & {c: number}) { }
      }
      class B {}`);

      const method = getFirstMethod(diagram);
      expect(method.parameters[0].type).toEqual(
        'number | B | A | ({ a: string; b: B; } & { c: number; })'
      );
    });

    test('should return type be from another file', () => {
      const diagram = createDiagramFromFiles([
        ['index.ts', "import {B} from './file'; export class A {m1(): B {}}"],
        ['file.ts', 'export class B {}'],
      ]);

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual('B');
    });

    test('should return type be void', () => {
      const diagram = createDiagram('export class A {m1() { }}');

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual('void');
    });

    test('should detected simple returned type from returened value', () => {
      const diagram = createDiagram('export class A {m1() { return 1; }}');

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual('number');
    });

    test('should detected advanced returned type from returened value', () => {
      const diagram = createDiagram(
        'export class A {m1(a: boolean) { return a ? new A() : 1 as number }}'
      );

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual('number | A');
    });

    test('should have correct access modifiers', () => {
      const diagram = createDiagram(`export class A {
        m1() {}
        public m2() {}
        private m3() {}
        protected m4() {}
    }`);

      const element = diagram.getElements()[0];

      expect(element.getMethods().map(m => m.accessModifier)).toEqual([
        'public',
        'public',
        'private',
        'protected',
      ]);
    });
  });

  describe('Properties', () => {
    test('should class elements contains properties', () => {
      const diagram = createDiagram(
        'export class A {p1 = "val"; private p2: boolean;}'
      );

      const element = diagram.getElements()[0];
      expect(element.getProperties()).toHaveLength(2);
    });

    test('should property info be correct', () => {
      const diagram = createDiagram('export class A {p1 = "val";}');

      const property = getFirstProperty(diagram);
      expect(property).toMatchObject({
        name: 'p1',
        type: 'string',
        accessModifier: 'public',
      });
    });

    test('should detected advanced returned type from init value', () => {
      const diagram = createDiagram(
        'export class A {p1 = a ? new A() : 1 as number;}'
      );

      const property = getFirstProperty(diagram);
      expect(property.type).toEqual('number | A');
    });

    test('should type be from another file', () => {
      const diagram = createDiagramFromFiles([
        ['index.ts', "import {B} from './file'; export class A {p1: B;"],
        ['file.ts', 'export class B {}'],
      ]);

      const property = getFirstProperty(diagram);

      expect(property.type).toEqual('B');
    });

    test('should not specified type be any', () => {
      const diagram = createDiagram('export class A {p1;}');

      const property = getFirstProperty(diagram);

      expect(property.type).toEqual('any');
    });

    test('should type contain advanced types', () => {
      const diagram = createDiagram(`
      export class A { p1: B|A|number| {a: string, b: B} & {c: number};}
      class B {}`);

      const property = getFirstProperty(diagram);
      expect(property.type).toEqual(
        'number | B | A | ({ a: string; b: B; } & { c: number; })'
      );
    });

    test('should have correct access modifiers', () => {
      const diagram = createDiagram(`export class A {
        p1: string;
        public p2;
        private p3;
        protected p4;
    }`);

      const element = diagram.getElements()[0];

      expect(element.getProperties().map(m => m.accessModifier)).toEqual([
        'public',
        'public',
        'private',
        'protected',
      ]);
    });
  });

  describe('Accessors', () => {
    test('should class elements contains accessors', () => {
      const diagram = createDiagram(
        'export class A {get p1() { return "val"; }; private get p2(): boolean {}}'
      );

      const element = diagram.getElements()[0];
      expect(element.getAccessors()).toHaveLength(2);
    });

    test('should accessor info be correct', () => {
      const diagram = createDiagram(
        'export class A { get p1() {return  "val";}}'
      );

      const accessor = getFirstAccessor(diagram);
      expect(accessor).toMatchObject({
        name: 'p1',
        type: 'string',
        accessModifier: 'public',
      });
    });

    test('should detected advanced returned type from returned value', () => {
      const diagram = createDiagram(
        'export class A {get p1() {return a ? new A() : 1 as number;}}'
      );

      const accessor = getFirstAccessor(diagram);
      expect(accessor.type).toEqual('number | A');
    });

    test('should type be from another file', () => {
      const diagram = createDiagramFromFiles([
        [
          'index.ts',
          "import {B} from './file'; export class A {get p1(): B {}",
        ],
        ['file.ts', 'export class B {}'],
      ]);

      const accessor = getFirstAccessor(diagram);

      expect(accessor.type).toEqual('B');
    });

    test('should not specified type be void', () => {
      const diagram = createDiagram('export class A {get p1() {}}');

      const accessor = getFirstAccessor(diagram);

      expect(accessor.type).toEqual('void');
    });

    test('should type contain advanced types', () => {
      const diagram = createDiagram(`
      export class A { get p1(): B|A|number| {a: string, b: B} & {c: number} { };}
      class B {}`);

      const accessor = getFirstAccessor(diagram);
      expect(accessor.type).toEqual(
        'number | B | A | ({ a: string; b: B; } & { c: number; })'
      );
    });

    test('should have correct access modifiers', () => {
      const diagram = createDiagram(`export class A {
        get p1(): string{};
        public get p2(){};
        private get p3(){};
        protected get p4(){};
    }`);

      const element = diagram.getElements()[0];

      expect(element.getAccessors().map(m => m.accessModifier)).toEqual([
        'public',
        'public',
        'private',
        'protected',
      ]);
    });
  });
});

function getFirstMethod(diagram: ClassDiagram) {
  return diagram.getElements()[0].getMethods()[0];
}

function getFirstProperty(diagram: ClassDiagram) {
  return diagram.getElements()[0].getProperties()[0];
}

function getFirstAccessor(diagram: ClassDiagram) {
  return diagram.getElements()[0].getAccessors()[0];
}

function createDiagram(fileContent: string) {
  const builder = new ClassDiagramBuilder();
  return builder.create({classes: initElements(fileContent)});
}

function createDiagramFromFiles(files: [string, string][]) {
  const builder = new ClassDiagramBuilder();
  return builder.create({classes: initElementsWithFiles(files)});
}

function initElements(fileContent: string) {
  const {sourceFile} = initProject(fileContent);
  return search(sourceFile);
}

function initElementsWithFiles(files: [string, string][]) {
  const {firstFile} = initProjectWithFiles(files);
  expect(firstFile).toBeDefined();
  return search(firstFile!);
}

function search(sourceFile: SourceFile) {
  const searcher = new Searcher({checkOnlyExportKeyword: true});
  return searcher.search(sourceFile);
}
