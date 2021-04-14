import {ClassDiagramDTO, DiagramDataSource} from 'common';

export class MockDiagramDataSource implements DiagramDataSource {
  private dataChangedCallback?: (diagram?: ClassDiagramDTO) => void;

  refresh = () => {};

  dataChanged(cb: (diagram?: ClassDiagramDTO) => void): void {
    this.dataChangedCallback = cb;
  }

  notifyDataChanged(diagram?: ClassDiagramDTO) {
    this.dataChangedCallback?.(diagram);
  }
}

const mockDiagramDataSource = new MockDiagramDataSource();

export default mockDiagramDataSource;
