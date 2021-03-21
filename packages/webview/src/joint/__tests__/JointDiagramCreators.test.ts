// eslint-disable-next-line node/no-unpublished-import
import {AccessModifier, DiagramElementDTO} from '../../../../common/src';
import {jointCreatorsMapper} from '../JointDiagramCreators';
import {UmlClass, UmlInterface} from '../uml';
import {UmlFunction} from '../uml/UmlFunction';
import {UmlVariable} from '../uml/UmlVariable';

describe('JointDiagramCreators', () => {
  describe.each(['Interface', 'Class', 'Abstract'])(`%s`, type => {
    test.each<[AccessModifier, string]>([
      ['public', '+'],
      ['protected', '#'],
      ['private', '-'],
    ])(`should translate access modifier %s => %s`, (input, exp) => {
      const src: DiagramElementDTO = {
        id: '1',
        kind: `uml.${type}`,
        name: 'Mammal2',
        properties: [{name: 'dob1', type: 'Date', accessModifier: input}],
        accessors: [{name: 'acc1', type: 'string', accessModifier: input}],
        methods: [
          {
            name: 'm1',
            accessModifier: input,
            parameters: [],
            returnType: 'void',
          },
        ],
      };

      const jointElement = jointCreatorsMapper.element.get(src.kind)?.(
        src
      ) as UmlInterface;

      expect(jointElement.get('properties')).toEqual([
        `${exp} dob1: Date`,
        `${exp} acc1: string`,
      ]);
      expect(jointElement.get('methods')).toEqual([`${exp} m1(): void`]);
    });
  });

  test('should create joint diagram interface element', () => {
    const src: DiagramElementDTO = {
      id: '1',
      kind: 'uml.Interface',
      name: 'Mammal2',
      properties: [
        {name: 'dob1', type: 'Date', accessModifier: 'public'},
        {name: 'p2', type: 'string', accessModifier: 'private'},
      ],
      methods: [
        {
          name: 'setDateOfBirth',
          accessModifier: 'public',
          parameters: [{name: 'dob', type: 'Date'}],
          returnType: 'void',
        },
      ],
    };

    const jointElement = jointCreatorsMapper.element.get(src.kind)?.(
      src
    ) as UmlInterface;

    expect(jointElement).toBeDefined();
    expect(jointElement.getClassName()).toEqual(['<<interface>>', 'Mammal2']);
    const methods = jointElement.get('methods');
    expect(methods).toEqual(['+ setDateOfBirth(dob: Date): void']);
    const properties = jointElement.get('properties');
    expect(properties).toEqual(['+ dob1: Date', '- p2: string']);
  });

  test('should create joint diagram interface element', () => {
    const src: DiagramElementDTO = {
      id: '1',
      kind: 'uml.Class',
      name: 'Mammal2',
      properties: [
        {name: 'dob1', type: 'Date', accessModifier: 'public'},
        {name: 'p2', type: 'string', accessModifier: 'private'},
      ],
      accessors: [
        {name: 'acc1', type: 'Date', accessModifier: 'protected'},
        {name: 'p4', type: 'string', accessModifier: 'private'},
      ],
      methods: [
        {
          name: 'setDateOfBirth',
          accessModifier: 'protected',
          parameters: [{name: 'dob', type: 'Date'}],
          returnType: 'void',
        },
      ],
    };

    const jointElement = jointCreatorsMapper.element.get(src.kind)?.(
      src
    ) as UmlClass;

    expect(jointElement).toBeDefined();

    expect(jointElement.getClassName()).toEqual(['Mammal2']);

    const methods = jointElement.get('methods');
    expect(methods).toEqual(['# setDateOfBirth(dob: Date): void']);

    const properties = jointElement.get('properties');
    expect(properties).toEqual([
      '+ dob1: Date',
      '- p2: string',
      '# acc1: Date',
      '- p4: string',
    ]);
  });

  test('should create joint diagram function element', () => {
    const src: DiagramElementDTO = {
      id: '1',
      kind: 'uml.Function',
      name: 'fun1',
      parameters: [{name: 'param1', type: 'string'}],
      type: 'number',
    };

    const jointElement = jointCreatorsMapper.element.get(src.kind)?.(
      src
    ) as UmlFunction;

    expect(jointElement).toBeDefined();
    expect(jointElement.getClassName()).toEqual([
      '<<function>>',
      'fun1(param1: string): number',
    ]);
    expect(jointElement.attributes['type']).toEqual('uml.UmlFunction');
  });

  test('should create joint diagram variable element', () => {
    const src: DiagramElementDTO = {
      id: '1',
      kind: 'uml.Variable',
      name: 'var1',
      type: 'string',
    };

    const jointElement = jointCreatorsMapper.element.get(src.kind)?.(
      src
    ) as UmlVariable;

    expect(jointElement).toBeDefined();
    expect(jointElement.getClassName()).toEqual(['<<var>>', 'var1: string']);
    expect(jointElement.attributes['type']).toEqual('uml.UmlVariable');
  });
});
