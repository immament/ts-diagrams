/* istanbul ignore file */

import * as joint from 'jointjs';
import {
  DiagramSkeleton,
  SkeletonElement,
  SkeletonLink,
} from '../diagram/DiagramSkeleton';
import {diagram} from './diagram';

export function sampleDiagram(
  el: HTMLElement,
  options: {
    width?: joint.dia.Paper.Dimension;
    height?: joint.dia.Paper.Dimension;
  } = {}
) {
  const skeleton = createSkeleton();

  diagram(el, {...options, skeleton});

  function createSkeleton(): DiagramSkeleton {
    return {
      elements: createElements(),
      links: createLinks(),
    };
  }

  function createLinks(): SkeletonLink[] {
    return [
      {fromId: '2', toId: '1', type: 'uml.Association'},
      {fromId: '3', toId: '1', type: 'uml.Generalization'},
      {fromId: '4', toId: '1', type: 'uml.Aggreagation'},
      {fromId: '4', toId: '3', type: 'uml.Composition'},
    ];
  }

  function createMultiElements() {
    const elements = [];
    for (let i = 0; i < 10; i++) {
      elements.push(...createElements());
    }
    return elements;
  }

  function createElements(): SkeletonElement[] {
    return [
      {
        id: '1',
        type: 'uml.Interface',
        name: 'Mammal2',
        properties: [
          'dob1: Date',
          'dob2: Date',
          'dob3: Date',
          'dob4: Date',
          'dob5: Date',
        ],
        methods: [
          '+ setDateOfBirth(dob: Date): Void',
          '+ getAgeAsDays1(): number | string | Date | undefined',
          '+ getAgeAsDays2(): Numeric',
          '- getAgeAsDays3(): Numeric',
        ],
      },
      {
        id: '2',
        type: 'uml.Class',
        name: 'BloodGroup',
        properties: [
          'dob1: Date',
          'dob2: Date',
          'dob3: Date',
          'dob4: Date',
          'dob5: Date',
        ],
      },
      {
        id: '3',
        type: 'uml.Abstract',
        name: 'BloodGroup',
        methods: ['+ isCompatible(bG: String): Boolean'],
      },
      {
        id: '4',
        type: 'uml.Unknown',
        name: 'Unknown',
        methods: ['+ isCompatible(bG: String): Boolean'],
      },
    ];
  }
}
