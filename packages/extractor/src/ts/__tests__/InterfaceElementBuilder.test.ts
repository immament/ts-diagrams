import {
  createDiagram,
  createDiagramFromFiles,
  createDiagramWithLoadLibs,
  getFirstMethod,
  getFirstProperty,
} from './utils';

describe('ClassDiagram Interfaces', () => {
  test('should create diagram with interface element with correct name', () => {
    const diagram = createDiagram('export interface A {}');
    const elements = diagram.getElements();
    expect(elements).toHaveLength(1);
    expect(elements[0].name).toEqual('A');
  });

  test('should interface elements contains methods, properties', () => {
    const diagram = createDiagram(`export interface A {
      p1: string;
      m1(): string;
    }`);

    const element = diagram.getElements()[0];
    expect(element.getMethods()).toHaveLength(1);
    expect(element.getProperties()).toHaveLength(1);
  });

  describe('Methods', () => {
    test('should returns full method signature', () => {
      const diagram = createDiagramWithLoadLibs(`export interface A {
        m1(param1: number, param2: string): string;
      }`);

      const method = getFirstMethod(diagram);
      expect(method).toMatchObject({
        name: 'm1',
        returnType: 'string',
        parameters: [
          {name: 'param1', type: 'number'},
          {name: 'param2', type: 'string'},
        ],
      });
    });

    test('should returned type contain advanced types', () => {
      const diagram = createDiagram(`
      export interface A {
        m1(): B|A|number| {a: string, b: B} & {c: number};
      }
      interface B {}`);

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual(
        'number | B | A | ({ a: string; b: B; } & { c: number; })'
      );
    });

    test('should parameter type contain advanced types', () => {
      const diagram = createDiagram(`
      export interface A {
        m1(p: B|A|number| {a: string, b: B} & {c: number}): void;
      }
      interface B {}`);

      const method = getFirstMethod(diagram);
      expect(method.parameters[0].type).toEqual(
        'number | B | A | ({ a: string; b: B; } & { c: number; })'
      );
    });

    test('should return type be from another file', () => {
      const diagram = createDiagramFromFiles([
        ['index.ts', "import {B} from './file'; export interface A {m1(): B;"],
        ['file.ts', 'export interface B {}'],
      ]);

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual('B');
    });

    test('should return type be any if not defined', () => {
      const diagram = createDiagram('export interface A {m1();');

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual('any');
    });

    test('should return type be string[] (load libs)', () => {
      const diagram = createDiagramWithLoadLibs(
        'export interface A {m1():string[];'
      );

      const method = getFirstMethod(diagram);
      expect(method.returnType).toEqual('string[]');
    });
  });

  describe('Properties', () => {
    test('should property info be correct', () => {
      const diagram = createDiagram('export interface A {p1: string;}');

      const property = getFirstProperty(diagram);
      expect(property).toMatchObject({
        name: 'p1',
        type: 'string',
        accessModifier: 'public',
      });
    });

    test('should type be from another file', () => {
      const diagram = createDiagramFromFiles([
        ['index.ts', "import {B} from './file'; export interface A {p1: B;"],
        ['file.ts', 'export interface B {}'],
      ]);

      const property = getFirstProperty(diagram);

      expect(property.type).toEqual('B');
    });

    test('should not specified type be any', () => {
      const diagram = createDiagram('export interface A {p1;}');

      const property = getFirstProperty(diagram);

      expect(property.type).toEqual('any');
    });

    test('should type contain advanced types', () => {
      const diagram = createDiagram(`
      export interface A { p1: B|A|number| {a: string, b: B} & {c: number};}
      interface B {}`);

      const property = getFirstProperty(diagram);
      expect(property.type).toEqual(
        'number | B | A | ({ a: string; b: B; } & { c: number; })'
      );
    });
  });
});
