import {DiagramDataSource} from '../repository/DiagramDataSource';
import {DiagramPresenter} from '../view/DiagramPresenter';

export class ShowDiagramInteractor {
  constructor(
    private dataSource: DiagramDataSource,
    private presenter: DiagramPresenter
  ) {
    this.listenDataChanges(dataSource);
  }

  getPresenter() {
    return this.presenter;
  }

  refresh() {
    return this.dataSource.refresh();
  }

  private listenDataChanges(dataSource: DiagramDataSource) {
    dataSource.dataChanged(diagram => {
      this.presenter.show({diagram});
    });
  }
}
