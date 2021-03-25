// eslint-disable-next-line node/no-unpublished-import
import {ClassDiagramDTO} from '../../../../../common/src';
import {createDiagram} from '../createDiagram';
import {createSampleDiagramDTO} from './sampleJointDiagram';

describe('joint diagram', () => {
  let mockElement: HTMLDivElement;
  beforeEach(() => {
    mockElement = document.createElement('div');
  });

  test('should contains 7 elements', () => {
    createDiagram(mockElement, {diagram: createSampleDiagramDTO()});

    expect(mockElement.innerHTML.includes('Mammal2')).toBeTruthy();
    expect(mockElement.querySelectorAll('.joint-type-uml').length).toBe(7);
  });

  test('should refresh', () => {
    const diagramDTO: ClassDiagramDTO = {
      elements: [{id: '1', kind: 'uml.Class', name: 'FirstName'}],
      links: [],
    };

    const diagram = createDiagram(mockElement!, {
      diagram: diagramDTO,
    });

    expect(mockElement.innerHTML.includes('FirstName')).toBeTruthy();

    const changedDiagramDTO: ClassDiagramDTO = {
      elements: [{id: '1', kind: 'uml.Class', name: 'ChangedName'}],
      links: [],
    };

    diagram.refresh(changedDiagramDTO);

    expect(mockElement.innerHTML.includes('ChangedName')).toBeTruthy();
    expect(mockElement.innerHTML.includes('FirstName')).toBeFalsy();
  });
});
