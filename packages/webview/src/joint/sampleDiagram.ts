/* istanbul ignore file */

import * as joint from 'jointjs';
import {DiagramSkeleton, SkeletonElement} from '../diagram/DiagramSkeleton';
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
      elements: cteateMultiElements(),
    };
  }

  function createRelations() {
    return [
      // new uml.Generalization({
      //   source: {id: items[0].id},
      //   target: {id: items[1].id},
      //   attrs: {'.link-tools': {display: 'none'}},
      // }),
    ];
  }

  function cteateMultiElements() {
    const elements = [];
    for (let i = 0; i < 10; i++) {
      elements.push(...createElements());
    }
    return elements;
  }

  function createElements(): SkeletonElement[] {
    return [
      {
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
        type: 'uml.Abstract',
        name: 'BloodGroup',
        methods: ['+ isCompatible(bG: String): Boolean'],
      },
      {
        type: 'uml.Unknown',
        name: 'Unknown',
        methods: ['+ isCompatible(bG: String): Boolean'],
      },
    ];
  }
}
