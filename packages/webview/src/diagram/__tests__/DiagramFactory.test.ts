import {DiagramElementCreator, DiagramFactory} from '../DiagramFactory';
import {SkeletonElement} from '../DiagramSkeleton';

type ElementBaseType = {elementName: string; type: string};

function createMapperItem(
  type: string
): [string, DiagramElementCreator<ElementBaseType>] {
  return [type, (e: SkeletonElement) => ({type, elementName: e.name})];
}

const creatorsMapper = new Map<string, DiagramElementCreator<ElementBaseType>>([
  createMapperItem('uml.Class'),
  createMapperItem('uml.Interface'),
  createMapperItem('uml.Abstract'),
]);

// createMapperItem('uml.Interface'),
// createMapperItem('uml.Abstract'),

describe('Diagram factory', () => {
  const defaultCreator = (element: SkeletonElement) => ({
    elementName: element.name,
    type: 'default',
  });

  let factory: DiagramFactory<ElementBaseType>;

  beforeEach(() => {
    factory = new DiagramFactory(creatorsMapper, defaultCreator);
  });

  test('should create empty Diagram Content', () => {
    const content = factory.create({elements: []});

    expect(content.cells).toHaveLength(0);
  });

  test.each(['uml.Class', 'uml.Interface'])('should create %s', type => {
    const {cells} = factory.create({
      elements: [{name: 'Name', type}],
    });
    expect(cells.length).toEqual(1);
    expect(cells[0]).toEqual({elementName: 'Name', type});
  });

  test('should create default element', () => {
    const {cells} = factory.create({
      elements: [{name: 'Name', type: 'unknown'}],
    });

    expect(cells.length).toEqual(1);
    expect(cells[0]).toEqual({elementName: 'Name', type: 'default'});
  });

  test('should create many elements', () => {
    const {cells} = factory.create({
      elements: [
        {name: 'Class1', type: 'uml.Class'},
        {name: 'Interface1', type: 'uml.Interface'},
        {name: 'Unknown1', type: 'unknown'},
      ],
    });

    expect(cells.length).toEqual(3);
    expect(cells.map(e => e.type)).toEqual([
      'uml.Class',
      'uml.Interface',
      'default',
    ]);
  });
});
