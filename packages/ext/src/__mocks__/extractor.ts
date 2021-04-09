import {ClassDiagramDTO} from 'common';
import {Subject} from 'rxjs';

export let currentSubject: Subject<ClassDiagramDTO>;

export const ClassDiagramExtractor = jest.fn().mockImplementation(() => ({
  extract: () => {
    currentSubject = new Subject<ClassDiagramDTO>();
    return {
      diagrams$: currentSubject.asObservable(),
      close: () => currentSubject.unsubscribe(),
    };
  },
}));
