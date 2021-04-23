import {initProjectWithFiles} from 'src/ts/__tests__/initProject';
import {Reference, ReferenceSearcher} from '../ReferenceSearcher';

describe.each([
  ['one file', prepareOneFile],
  ['two files', prepareTwoFiles],
])('%s', (_, prepare) => {
  describe('Class & interface', () => {
    test.each([
      [
        'class extends class',
        ['export class A {}', 'export class B extends A {}'],
        'extends',
        1,
      ],
      [
        'class implements class',
        ['export class A {}', 'export class B implements A {}'],
        'implements',
        1,
      ],
      [
        'class implements interface',
        ['export interface A {}', 'export class B implements A {}'],
        'implements',
        1,
      ],
      [
        'interface extends interface',
        ['export interface A {}', 'export interface B extends A {}'],
        'extends',
        1,
      ],
      [
        'interface extends multiple interfaces',
        [
          'export interface A {}',
          `export interface B extends A, C, D {} 
          export interface C {} 
          export interface D {}`,
        ],
        'extends',
        3,
      ],
      [
        'reference in class methods',
        [
          'export class A {}',
          `export class B { 
            m1(param1: A):A { const a: A; }
            m2() { return A;}
          }`,
        ],
        'use',
        4,
      ],
      [
        'reference in class property',
        [
          'export interface A {}',
          `export class B { 
            p1: A;
          }`,
        ],
        'association',
        1,
      ],
    ])('%s', (_, contents, expectedType, expectedLinks) => {
      const files = prepare(contents);
      const nodes = getExportedNodes(files);

      const references = new ReferenceSearcher().search(nodes);

      expect(references).toHaveLength(expectedLinks);

      expectReference(references[0], {
        from: nodes[1],
        to: nodes[0],
        type: expectedType,
      });
      references.forEach(r => expect(r.type).toBe(expectedType));
    });

    test('should class implement and extend', () => {
      const files = prepare([
        'export interface A {}',
        `export interface B {}
        export class C {}
        export class T implements A, B extends C {}`,
      ]);

      const nodes = getExportedNodes(files);

      const references = new ReferenceSearcher().search(nodes);
      expect(references).toHaveLength(3);
      expect(references.filter(r => r.type === 'implements')).toHaveLength(2);
      expect(references.filter(r => r.type === 'extends')).toHaveLength(1);
    });
  });
});

function prepareOneFile(files: string[]): string[] {
  return [files.join('\n')];
}

function prepareTwoFiles(files: string[]): string[] {
  return [files[0], 'import {A} from "./file0"; ' + files[1]];
}

function getExportedNodes(files: string[]) {
  const {sourceFiles} = initProjectWithFiles(
    files.map((content, index) => [`file${index}.ts`, content])
  );

  const nodes = sourceFiles.flatMap(sf =>
    [...sf.getExportedDeclarations().values()].flatMap(f => f)
  );
  return nodes;
}

function expectReference(ref: Reference, expected: Partial<Reference>) {
  expected.from && expect(ref.from === expected.from).toBeTruthy();
  expected.to && expect(ref.to === expected.to).toBeTruthy();
  expected.type && expect(ref.type).toBe(expected.type);
}
