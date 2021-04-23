import {ExtractorError} from '@common/TsError';
import {initProject} from 'src/ts/__tests__/initProject';
import {Node} from 'ts-morph';
import {ReferenceSearcher} from '../../ReferenceSearcher';
import {ClassDiagramBuilder} from '../ClassDiagramBuilder';

describe('ClassDiagramBuilder', () => {
  test('should build diagram', () => {
    const {sourceFile} = initProject(
      'export class A {} export class B extends A {}'
    );

    const classes = sourceFile.getClasses();

    const searcher = new ReferenceSearcher();
    const references = searcher.search(classes);
    expect(references).toHaveLength(1);

    const builder = new ClassDiagramBuilder();
    const diagram = builder.create({declarations: classes, references});

    expect(diagram.getElements()).toHaveLength(2);
    expect(diagram.getLinks()).toHaveLength(1);
  });

  test('should throw error when no builder for syntexKind', () => {
    const nodeStub = {
      getKind: () => 1,
      getKindName: () => 'SampleKind',
    } as Node;

    const builder = new ClassDiagramBuilder();

    expect(() => builder.create({declarations: [nodeStub]})).toThrowError(
      ExtractorError
    );
  });
});
