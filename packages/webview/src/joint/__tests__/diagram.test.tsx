import {
  DiagramSkeleton,
  SkeletonElement,
  SkeletonLink,
} from '../../diagram/DiagramSkeleton';
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
    links: createLinks(),
  };
}

function createLinks(): SkeletonLink[] {
  return [{fromId: '2', toId: '1', type: 'uml.Generalization'}];
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
      type: 'Unknown',
      name: 'Unknown',
      methods: ['+ isCompatible(bG: String): Boolean'],
    },
  ];
}
