import {ClassDiagramDTO} from './ClassDiagram';
import {DiagramDataSource} from './DiagramDataSource';

export class DiagramDataSourceProxy implements DiagramDataSource {
  private dataSource?: DiagramDataSource;

  private dataChangedCallbacks: ((diagram?: ClassDiagramDTO) => void)[] = [];

  constructor(dataSourcePromise: Promise<DiagramDataSource>) {
    dataSourcePromise.then(dataSource => {
      this.dataChangedCallbacks.forEach(cb => dataSource.dataChanged(cb));
      this.dataChangedCallbacks = [];

      this.dataSource = dataSource;
    });
  }

  refresh(): void {
    this.dataSource?.refresh();
  }

  dataChanged(cb: (diagram?: ClassDiagramDTO) => void) {
    if (this.dataSource) {
      this.dataSource.dataChanged(cb);
    } else {
      this.dataChangedCallbacks.push(cb);
    }
  }
}
