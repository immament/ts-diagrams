import * as joint from 'jointjs';
import {
  createPaper,
  expectText,
  expectTexts,
} from '../../../tests-utils/joint-utils';
import {
  METHODS_TEXT_SELECTOR,
  NAME_TEXT_SELECTOR,
  PROPERTIES_TEXT_SELECTOR,
  UmlClass,
  UmlClassView,
  UML_UPDATE_EVENT,
} from '../UmlClass';

describe('diagram', () => {
  describe('without graph', () => {
    test('should has correct name', () => {
      const umlClass = new UmlClass({
        name: ['Mammal'],
        properties: ['attr1: Date'],
      });

      expect(umlClass.getClassName()).toEqual(['Mammal']);
    });

    test('should attribbutes text updates', () => {
      const umlClass = new UmlClass({
        name: ['Mammal'],
        properties: ['attr1: Date'],
        methods: ['+ getName(): string'],
      });

      const attrs = umlClass.get('attrs');

      expect(attrs[NAME_TEXT_SELECTOR].text).toEqual('Mammal');
      expect(attrs[PROPERTIES_TEXT_SELECTOR].text).toEqual('attr1: Date');
      expect(attrs[METHODS_TEXT_SELECTOR].text).toEqual('+ getName(): string');
    });

    test('should raise change events', () => {
      const umlClass = new UmlClass();

      const newName = ['New Name'];
      const newPoperties = ['p1'];
      const newMethods = ['m1', 'm2'];

      expect.assertions(3);

      umlClass.on('change:name', (_, val) => {
        expect(val).toEqual(newName);
      });

      umlClass.on('change:properties', (_, val) => {
        expect(val).toEqual(newPoperties);
      });

      umlClass.on('change:methods', (_, val) => {
        expect(val).toEqual(newMethods);
      });

      umlClass.set('name', newName);
      umlClass.set('properties', newPoperties);
      umlClass.set('methods', newMethods);
    });

    test('should raise uml-update events', () => {
      const umlClass = new UmlClass();

      expect.assertions(3);

      umlClass.on(UML_UPDATE_EVENT, () => {
        expect(true).toBe(true);
      });

      umlClass.set('name', ['a']);
      umlClass.set('properties', ['b']);
      umlClass.set('methods', ['c']);
    });
  });

  describe('With graph', () => {
    let graph: joint.dia.Graph;
    let paper: joint.dia.Paper;
    beforeEach(() => {
      graph = new joint.dia.Graph();
      paper = createPaper(graph);
    });

    test('should graph contain UmlClass', () => {
      const umlClass = new UmlClass({
        name: ['Mammal'],
      });

      umlClass.addTo(graph);

      expect(graph.getCell(umlClass.cid)).toBe(umlClass);
    });

    test('should UmlClass use UmlClassView', () => {
      const umlClass = new UmlClass({
        name: ['Mammal'],
      });

      umlClass.addTo(graph);
      const view = paper.findViewByModel(umlClass);

      expect(view).toBeDefined();
      expect(view).toBeInstanceOf(UmlClassView);
    });

    test('should render texts', () => {
      const umlClass = new UmlClass({
        name: ['Mammal'],
        properties: ['attr1:Date'],
      });

      umlClass.addTo(graph);
      const view = paper.findViewByModel(umlClass);
      expectText(view, NAME_TEXT_SELECTOR, 'Mammal');
      expectText(view, PROPERTIES_TEXT_SELECTOR, 'attr1:Date');
      expectText(view, METHODS_TEXT_SELECTOR, '-');
    });

    test('should update texts', () => {
      const umlClass = new UmlClass({
        name: ['Mammal'],
        properties: ['attr1:Date'],
      });

      umlClass.addTo(graph);
      const view = paper.findViewByModel(umlClass);

      umlClass.set('name', ['New Name']);
      expectText(view, NAME_TEXT_SELECTOR, 'New Name');

      umlClass.set('properties', ['attr2: string']);
      expectText(view, PROPERTIES_TEXT_SELECTOR, 'attr2: string');

      umlClass.set('methods', ['newMethod(v: number): string']);
      expectText(view, METHODS_TEXT_SELECTOR, 'newMethod(v: number): string');
    });

    test('should display multiline elements', () => {
      const umlClass = new UmlClass({
        name: ['Abstract', 'Mammal'],
        properties: ['attr1: Date', 'attr2: Date'],
        methods: ['m1(): Date', 'm2(): Date'],
      });

      umlClass.addTo(graph);
      const view = paper.findViewByModel(umlClass);

      expectTexts(view, [
        'AbstractMammal',
        'attr1: Dateattr2: Date',
        'm1(): Datem2(): Date',
      ]);
    });
  });
});
