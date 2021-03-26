import {
  createDiagram,
  createDiagramFromFiles,
  createDiagramWithLoadLibs,
} from './utils';

describe('Function Element Builder', () => {
  test('should create diagram with function element with correct name', () => {
    const diagram = createDiagram('export function a() {}');
    const elements = diagram.getElements();
    expect(elements).toHaveLength(1);
    expect(elements[0].name).toEqual('a');
  });

  test('should returns full function signature', () => {
    const diagram = createDiagram(
      'export function m1(param1: number, param2: string): string {};'
    );

    const [el] = diagram.getElements();
    expect(el).toMatchObject({
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
    export function m1(): B|number| {a: string, b: B} & {c: number} { return 'a'}
    interface B {}`);

    const func = diagram.getFirstFunctionElementOrThrow();
    expect(func.returnType).toEqual(
      'number | B | ({ a: string; b: B; } & { c: number; })'
    );
  });

  test('should parameter type contain advanced types', () => {
    const diagram = createDiagram(`
    export function m1(p: B|number| {a: string, b: B} & {c: number}): void {}
    interface B {}`);

    const func = diagram.getFirstFunctionElementOrThrow();
    expect(func.parameters[0].type).toEqual(
      'number | B | ({ a: string; b: B; } & { c: number; })'
    );
  });

  test('should return type be from another file', () => {
    const diagram = createDiagramFromFiles([
      ['index.ts', "import {B} from './file'; export function m1(): B {}"],
      ['file.ts', 'export interface B {}'],
    ]);

    const func = diagram.getFirstFunctionElementOrThrow();
    expect(func.returnType).toEqual('B');
  });

  test('should return type be void if not defined', () => {
    const diagram = createDiagram('export function m1() {}');

    const func = diagram.getFirstFunctionElementOrThrow();
    expect(func.returnType).toEqual('void');
  });

  test('should return type be string[] (load libs)', () => {
    const diagram = createDiagramWithLoadLibs(
      'export function m1():string[] {}'
    );

    const func = diagram.getFirstFunctionElementOrThrow();
    expect(func.returnType).toEqual('string[]');
  });
});
