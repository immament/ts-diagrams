import {ClassDiagramDTO} from '../../../../common/src';
import {DiagramDataSource} from '../DiagramDataSource';

export class DiagramDataSourceMock implements DiagramDataSource {
  private dataChangedCallback?: (diagram?: ClassDiagramDTO) => void;

  refresh(): void {}
  dataChanged(cb: (diagram?: ClassDiagramDTO) => void): void {
    this.dataChangedCallback = cb;
  }

  notifyDataChanged(diagram?: ClassDiagramDTO) {
    this.dataChangedCallback?.(diagram);
  }
}
