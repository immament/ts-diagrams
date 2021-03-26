import {ClassDiagramDTO} from 'common';
import {DiagramDataSource} from '../repository/DiagramDataSource';

export class DiagramDataSourceMock implements DiagramDataSource {
  private dataChangedCallback?: (diagram?: ClassDiagramDTO) => void;

  refresh = jest.fn();

  dataChanged(cb: (diagram?: ClassDiagramDTO) => void): void {
    this.dataChangedCallback = cb;
  }

  notifyDataChanged(diagram?: ClassDiagramDTO) {
    this.dataChangedCallback?.(diagram);
  }
}
