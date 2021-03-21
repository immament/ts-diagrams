// eslint-disable-next-line node/no-unpublished-import
import {DiagramElementDTO, LinkElementDTO} from '../../../../common/src';
import {createDiagram} from '../diagram';

describe('diagram', () => {
  test('should', () => {
    const mockElement = document.createElement('div');

    createDiagram(mockElement!, {diagram: createDiagramDTO()});

    expect(mockElement.innerHTML.includes('Mammal2')).toBeTruthy();
  });
});

function createDiagramDTO() {
  return {
    elements: createElements(),
    links: createLinks(),
  };
}

function createLinks(): LinkElementDTO[] {
  return [{fromId: '2', toId: '1', kind: 'uml.Generalization'}];
}

function createElements(): DiagramElementDTO[] {
  return [
    {
      id: '1',
      kind: 'uml.Interface',
      name: 'Mammal2',
      properties: [{name: 'dob1', type: 'Date', accessModifier: 'public'}],
      methods: [
        {
          name: 'setDateOfBirth',
          accessModifier: 'public',
          parameters: [{name: 'dob', type: 'Date'}],
          returnType: 'void',
        },
        {
          name: 'getAgeAsDays1',
          accessModifier: 'public',
          parameters: [],
          returnType: 'number | string | Date | undefined',
        },
        {
          name: '+ getAgeAsDays2',
          accessModifier: 'public',
          parameters: [],
          returnType: 'number',
        },
        {
          name: '- getAgeAsDays3',
          accessModifier: 'public',
          parameters: [],
          returnType: 'number',
        },
      ],
    },
    {
      id: '2',
      kind: 'uml.Class',
      name: 'BloodGroup',
      properties: [{name: 'dob1', type: 'Date', accessModifier: 'public'}],
    },
    {
      id: '3',
      kind: 'uml.Abstract',
      name: 'BloodGroup',
      methods: [
        {
          name: 'isCompatible',
          accessModifier: 'public',
          parameters: [{name: 'bg', type: 'string'}],
          returnType: 'boolean',
        },
      ],
    },
    {
      id: '4',
      kind: 'Unknown',
      name: 'Unknown',
      methods: [
        {
          name: 'isCompatible',
          accessModifier: 'public',
          parameters: [{name: 'bg', type: 'string'}],
          returnType: 'boolean',
        },
      ],
    },
  ];
}
