import {
  Creators,
  DiagramElementCreator,
  DiagramFactory,
  DiagramLinkCreator,
} from '../DiagramFactory';
import {SkeletonElement} from '../DiagramSkeleton';

type ElementBaseType = {elementName: string; type: string};
type LinkBaseType = {
  name?: string;
  type: string;
  from?: ElementBaseType;
  to?: ElementBaseType;
};

function createElementMapper(
  type: string
): [string, DiagramElementCreator<ElementBaseType>] {
  return [type, (e: SkeletonElement) => ({type, elementName: e.name})];
}

function createLinkMapper(
  type: string
): [string, DiagramLinkCreator<LinkBaseType, ElementBaseType>] {
  return [
    type,
    (link, idsToElements) => ({
      name: link.name,
      type: link.type,
      from: idsToElements.get(link.fromId),
      to: idsToElements.get(link.toId),
    }),
  ];
}

const creators: Creators<ElementBaseType, LinkBaseType> = {
  element: new Map<string, DiagramElementCreator<ElementBaseType>>([
    createElementMapper('uml.Class'),
    createElementMapper('uml.Interface'),
    createElementMapper('uml.Abstract'),
  ]),
  defaultElement: (element: SkeletonElement) => ({
    elementName: element.name,
    type: 'default',
  }),
  link: new Map<string, DiagramLinkCreator<LinkBaseType, ElementBaseType>>([
    createLinkMapper('Generalization'),
  ]),
  defaultLink: (link, idsToElements) => ({
    name: link.name,
    type: 'default',
    from: idsToElements.get(link.fromId),
    to: idsToElements.get(link.toId),
  }),
};

describe('Diagram factory', () => {
  let factory: DiagramFactory<ElementBaseType, LinkBaseType>;

  test('should create empty Diagram Content', () => {
    const content = factory.create({elements: [], links: []});

    expect(content.elements).toHaveLength(0);
  });

  beforeEach(() => {
    factory = new DiagramFactory(creators);
  });

  describe('create Elements', () => {
    test.each(['uml.Class', 'uml.Interface'])('should create %s', type => {
      const {elements: cells} = factory.create({
        elements: [{id: '1', name: 'Name', type}],
        links: [],
      });
      expect(cells.length).toEqual(1);
      expect(cells[0]).toEqual({elementName: 'Name', type});
    });

    test('should create default element', () => {
      const {elements: cells} = factory.create({
        elements: [{id: '1', name: 'Name', type: 'unknown'}],
        links: [],
      });

      expect(cells.length).toEqual(1);
      expect(cells[0]).toEqual({elementName: 'Name', type: 'default'});
    });

    test('should create many elements', () => {
      const {elements: cells} = factory.create({
        elements: [
          {id: '1', name: 'Class1', type: 'uml.Class'},
          {id: '2', name: 'Interface1', type: 'uml.Interface'},
          {id: '3', name: 'Unknown1', type: 'unknown'},
        ],
        links: [],
      });

      expect(cells.length).toEqual(3);
      expect(cells.map(e => e.type)).toEqual([
        'uml.Class',
        'uml.Interface',
        'default',
      ]);
    });
  });
  describe('create Links', () => {
    test('should create link', () => {
      const {links} = factory.create({
        elements: [
          {id: '1', name: 'Class1', type: 'uml.Class'},
          {id: '2', name: 'Interface1', type: 'uml.Interface'},
        ],
        links: [{fromId: '1', toId: '2', type: 'Generalization'}],
      });

      expect(links.length).toEqual(1);
      expect(links[0]).toMatchObject({
        type: 'Generalization',
        from: {elementName: 'Class1'},
        to: {elementName: 'Interface1'},
      });
    });

    test('should create deafult link', () => {
      const {links} = factory.create({
        elements: [
          {id: '1', name: 'Class1', type: 'uml.Class'},
          {id: '2', name: 'Interface1', type: 'uml.Interface'},
        ],
        links: [{fromId: '1', toId: '2', type: 'unknown'}],
      });

      expect(links.length).toEqual(1);
      expect(links[0]).toMatchObject({
        type: 'default',
        from: {elementName: 'Class1'},
        to: {elementName: 'Interface1'},
      });
    });
  });
});
