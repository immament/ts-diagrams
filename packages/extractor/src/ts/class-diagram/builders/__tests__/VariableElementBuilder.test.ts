import {createDiagram, createDiagramFromFiles} from '../../__tests__/utils';

describe('Variable Element Builder', () => {
  test('should fount var, const, let', () => {
    const diagram = createDiagram(
      'export const a; export let b; export let c;'
    );
    const elements = diagram.getElements();
    expect(elements).toHaveLength(3);
    expect(elements.map(e => e.name)).toEqual(['a', 'b', 'c']);
  });

  test('should fount multiple variables in one statement', () => {
    const diagram = createDiagram('export const a, b, c;');
    const elements = diagram.getElements();
    expect(elements).toHaveLength(3);
    expect(elements.map(e => e.name)).toEqual(['a', 'b', 'c']);
  });

  test('should fount var, const, let', () => {
    const diagram = createDiagram(
      'export const a; export let b; export let c;'
    );
    const elements = diagram.getElements();
    expect(elements).toHaveLength(3);
    expect(elements.map(e => e.name)).toEqual(['a', 'b', 'c']);
  });

  test('should property info be correct', () => {
    const diagram = createDiagram('export const p1: string = "val"');

    const property = diagram.getFirstVariableElementOrThrow();
    expect(property).toMatchObject({
      name: 'p1',
      type: 'string',
    });
  });

  test('should detected union type from init value', () => {
    const diagram = createDiagram(
      `const a = 1;
      export const p1 = a ? 1 as number : 'aaa' as string ;`
    );

    const property = diagram.getFirstVariableElementOrThrow();
    expect(property.type).toEqual('string | number');
  });

  test('should detected advanced type from init value', () => {
    const diagram = createDiagram(
      `const a = 1;
      export const p1 = a ? new B() : new A() ;
      class A {}
      class B {}`
    );

    const property = diagram.getFirstVariableElementOrThrow();
    expect(property.type).toEqual('B | A');
  });

  test('should type be from another file', () => {
    const diagram = createDiagramFromFiles([
      ['index.ts', "import {B} from './file'; export let p1: B"],
      ['file.ts', 'export class B {}'],
    ]);

    const property = diagram.getFirstVariableElementOrThrow();
    expect(property.type).toEqual('B');
  });

  test('should not specified type be any', () => {
    const diagram = createDiagram('export var p1;');

    const property = diagram.getFirstVariableElementOrThrow();

    expect(property.type).toEqual('any');
  });

  test('should type contain advanced types', () => {
    const diagram = createDiagram(`
    export const p1: B|number| {a: string, b: B} & {c: number};
    class B {}`);

    const property = diagram.getFirstVariableElementOrThrow();
    expect(property.type).toEqual(
      'number | B | ({ a: string; b: B; } & { c: number; })'
    );
  });
});
