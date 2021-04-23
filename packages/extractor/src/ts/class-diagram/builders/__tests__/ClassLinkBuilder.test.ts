import {DiagramElement, DiagramLink} from '@common/ClassDiagram';
import {initProject} from 'src/ts/__tests__/initProject';
import {Node} from 'ts-morph';
import {ReferenceSearcher} from '../../ReferenceSearcher';
import {LinksBuilder} from '../LinksBuilder';

describe('LinksBuilder', () => {
  test('should found class extends', () => {
    const {sourceFile} = initProject(
      'export class A {} export class B extends A {}'
    );

    const classes = sourceFile.getClasses();

    const searcher = new ReferenceSearcher();
    const references = searcher.search(classes);
    expect(references).toHaveLength(1);

    const nodeToElementMap = new WeakMap<Node, DiagramElement>(
      classes.map((node, index) => [
        node,
        {id: index.toString()} as DiagramElement,
      ])
    );
    const builder = new LinksBuilder(nodeToElementMap);

    const link = builder.create(references[0]);

    expect(link).toMatchObject<DiagramLink>({
      fromId: '1',
      toId: '0',
      type: 'extends',
    });
  });
});
