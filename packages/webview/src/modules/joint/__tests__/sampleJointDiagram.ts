/* eslint-disable node/no-unpublished-import */
/* istanbul ignore file */
import {ClassDiagramDTO, DiagramElementDTO, LinkElementDTO} from 'common';

export function createSampleDiagramDTO() {
  return createDiagram();

  //window.postMessage({command: 'diagram', diagram}, '*');

  function createDiagram(): ClassDiagramDTO {
    return {
      elements: createElements(),
      links: createLinks(),
    };
  }

  function createLinks(): LinkElementDTO[] {
    return [
      {fromId: '2', toId: '1', kind: 'uml.Association'},
      {fromId: '3', toId: '1', kind: 'uml.Generalization'},
      {fromId: '4', toId: '1', kind: 'uml.Aggreagation'},
      {fromId: '4', toId: '3', kind: 'uml.Composition'},
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function createMultiElements() {
    const elements = [];
    for (let i = 0; i < 10; i++) {
      elements.push(...createElements());
    }
    return elements;
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
            name: 'getAgeAsDays2',
            accessModifier: 'public',
            parameters: [],
            returnType: 'number',
          },
          {
            name: 'getAgeAsDays3',
            accessModifier: 'private',
            parameters: [],
            returnType: 'number',
          },
        ],
      },
      {
        id: '2',
        kind: 'uml.Class',
        name: 'BloodGroup',
        properties: [{name: 'dob1', type: 'Date', accessModifier: 'protected'}],
        accessors: [{name: 'acc1', type: 'string', accessModifier: 'public'}],
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
}
