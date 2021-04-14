// eslint-disable-next-line node/no-unpublished-import

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {currentSubject} from 'extractor';
import {DiagramBuilderImpl} from '../DiagramBuilder';

describe('DiagramBuilder', () => {
  // it('should create diagram from memory', done => {
  //   const builder = new DiagramBuilderDemo();

  //   const diagramStream = builder.create();
  //   diagramStream.diagrams$.subscribe(diagram => {
  //     expect(diagram.elements).length(3);
  //     console.log(diagram);
  //     diagramStream.close();
  //     done();
  //   });
  // });

  it('should create diagram once', done => {
    const builder = new DiagramBuilderImpl();

    const diagramStream = builder.create();
    diagramStream.streams$.subscribe(diagram => {
      expect(diagram.elements).toHaveLength(3);
      diagramStream.close();
      done();
    });
    currentSubject.next({
      elements: [
        {id: '1', kind: 'uml.Class', name: 'A'},
        {id: '2', kind: 'uml.Class', name: 'C'},
        {id: '3', kind: 'uml.Class', name: 'B'},
      ],
      links: [],
    });
  });

  it('should listen diagram changes', done => {
    const builder = new DiagramBuilderImpl();

    const diagramStream = builder.create();

    const expectedResults = [{elementsCount: 1}, {elementsCount: 2}];
    let resultCounter = 0;
    diagramStream.streams$.subscribe(diagram => {
      expect(diagram.elements).toHaveLength(
        expectedResults[resultCounter].elementsCount
      );

      if (++resultCounter === 2) {
        diagramStream.close();
        done();
      }
    });

    currentSubject.next({
      elements: [{id: '1', kind: 'uml.Class', name: 'A'}],
      links: [],
    });

    currentSubject.next({
      elements: [
        {id: '1', kind: 'uml.Class', name: 'A'},
        {id: '2', kind: 'uml.Class', name: 'C'},
      ],
      links: [],
    });
  });
});
