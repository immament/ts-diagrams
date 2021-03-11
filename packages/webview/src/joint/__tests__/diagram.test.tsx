import {DiagramSkeleton, SkeletonElement} from '../../diagram/DiagramSkeleton';
import {diagram} from '../diagram';

describe('diagram', () => {
  test('should', () => {
    const mockElement = document.createElement('div');

    diagram(mockElement!, {skeleton: createSkeleton()});
  });
});

function createSkeleton(): DiagramSkeleton {
  return {
    elements: createElements(),
  };
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
      type: 'Unknown',
      name: 'Unknown',
      methods: ['+ isCompatible(bG: String): Boolean'],
    },
  ];
}
