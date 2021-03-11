import * as joint from 'jointjs';
import {
  NAME_TEXT_SELECTOR,
  UmlAbstract,
  UmlAbstractView,
  UmlClass,
  UmlClassView,
  UmlInterface,
  UmlInterfaceView,
} from '..';
import {createPaper, expectText} from '../../../tests-utils/joint-utils';
import {UmlUnknown, UmlUnknownView} from '../UmlUnknown';

describe.each([
  [UmlInterface, UmlInterfaceView, '<<interface>>'],
  [UmlAbstract, UmlAbstractView, '<<abstract>>'],
  [UmlUnknown, UmlUnknownView, ''],
])(
  '%p',
  (ctor: typeof UmlClass, viewType: typeof UmlClassView, stereotyp: string) => {
    test('should name contains stereotype', () => {
      const item = new ctor({
        name: ['Mammal'],
      });

      const expected = stereotyp.length ? [stereotyp, 'Mammal'] : ['Mammal'];
      expect(item.getClassName()).toEqual(expected);
    });

    test('should has proper type', () => {
      const item = new ctor({
        name: ['Mammal'],
      });

      expect(item.get('type')).toEqual(`uml.${ctor.name}`);
    });

    describe('With graph', () => {
      let graph: joint.dia.Graph;
      let paper: joint.dia.Paper;

      beforeEach(() => {
        graph = new joint.dia.Graph();
        paper = createPaper(graph);
      });

      test(`should use ${viewType.name}`, () => {
        const umlClass = new ctor({
          name: ['Mammal'],
        });

        umlClass.addTo(graph);
        const view = paper.findViewByModel(umlClass);

        expect(view).toBeDefined();
        expect(view).toBeInstanceOf(viewType);
      });

      test('should display stereotype in name', () => {
        const umlClass = new ctor({
          name: ['Mammal'],
        });

        umlClass.addTo(graph);
        const view = paper.findViewByModel(umlClass);
        expectText(view, NAME_TEXT_SELECTOR, `${stereotyp}Mammal`);
      });
    });
  }
);
