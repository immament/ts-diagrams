import {DiagramElementDTO} from 'common';
import {
  ClassDiagram,
  ClassElement,
  FunctionElement,
  InterfaceElement,
  VariableElement,
} from '../ClassDiagram';

describe('ClassDiagram toDTO', () => {
  test('should map class element with method', () => {
    const element = new ClassElement('C1', [
      {
        accessModifier: 'public',
        name: 'm1',
        returnType: 'string',
        parameters: [{name: 'p1', type: 'number'}],
      },
    ]);

    const expected: Partial<DiagramElementDTO> = {
      name: 'C1',
      kind: 'uml.Class',
      methods: [
        {
          accessModifier: 'public',
          name: 'm1',
          returnType: 'string',
          parameters: [{name: 'p1', type: 'number'}],
        },
      ],
    };

    const dto = element.toDTO();
    expect(dto).toMatchObject(expected);
  });

  test('should map class element with property', () => {
    const element = new ClassElement('C1', undefined, [
      {accessModifier: 'public', name: 'p1', type: 'string'},
    ]);

    const expected: Partial<DiagramElementDTO> = {
      name: 'C1',
      kind: 'uml.Class',
      properties: [{accessModifier: 'public', name: 'p1', type: 'string'}],
    };

    const dto = element.toDTO();
    expect(dto).toMatchObject(expected);
  });

  test('should map class element with accessor', () => {
    const element = new ClassElement('C1', undefined, undefined, [
      {accessModifier: 'public', name: 'a1', type: 'string'},
    ]);

    const expected: Partial<DiagramElementDTO> = {
      name: 'C1',
      kind: 'uml.Class',
      accessors: [{accessModifier: 'public', name: 'a1', type: 'string'}],
    };

    const dto = element.toDTO();
    expect(dto).toMatchObject(expected);
  });

  test('should map interface element with method and property', () => {
    const element = new InterfaceElement(
      'I1',
      [
        {
          accessModifier: 'public',
          name: 'm1',
          returnType: 'string',
          parameters: [{name: 'p1', type: 'number'}],
        },
      ],
      [{accessModifier: 'public', name: 'p1', type: 'string'}]
    );

    const expected: Partial<DiagramElementDTO> = {
      name: 'I1',
      kind: 'uml.Interface',
      methods: [
        {
          accessModifier: 'public',
          name: 'm1',
          returnType: 'string',
          parameters: [{name: 'p1', type: 'number'}],
        },
      ],
      properties: [{accessModifier: 'public', name: 'p1', type: 'string'}],
    };

    const dto = element.toDTO();
    expect(dto).toMatchObject(expected);
  });

  test('should map function element', () => {
    const element = new FunctionElement('f1', 'string', [
      {name: 'p1', type: 'number'},
    ]);

    const expected: Partial<DiagramElementDTO> = {
      name: 'f1',
      kind: 'uml.Function',
      type: 'string',
      parameters: [{name: 'p1', type: 'number'}],
    };

    const dto = element.toDTO();
    expect(dto).toMatchObject(expected);
  });

  test('should map variable element', () => {
    const element = new VariableElement('v1', 'string');

    const expected: Partial<DiagramElementDTO> = {
      name: 'v1',
      kind: 'uml.Variable',
      type: 'string',
    };

    const dto = element.toDTO();
    expect(dto).toMatchObject(expected);
  });

  test('should map diagram with elements', () => {
    const diagram = new ClassDiagram([
      new ClassElement('C1'),
      new InterfaceElement('I1'),
      new FunctionElement('f1', 'string'),
      new VariableElement('v1', 'string'),
    ]);

    const dto = diagram.toDTO();
    expect(dto).toMatchObject({
      elements: [
        {name: 'C1', kind: 'uml.Class'},
        {name: 'I1', kind: 'uml.Interface'},
        {name: 'f1', kind: 'uml.Function', type: 'string'},
        {name: 'v1', kind: 'uml.Variable', type: 'string'},
      ],
      links: [],
    });
  });
});
