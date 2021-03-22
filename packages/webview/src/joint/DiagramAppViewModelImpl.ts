import {ClassDiagramDTO} from '../../../common/src';
import BaseView from '../common/BaseView';
import {DiagramAppViewModel} from './DiagramAppViewModel';
import {DiagramDataSource} from './DiagramDataSource';

export class DiagramAppViewModelIml implements DiagramAppViewModel {
  private baseView?: BaseView;

  constructor(
    private dataSource: DiagramDataSource,
    public diagram?: ClassDiagramDTO
  ) {
    // listenDiagramChangedMessage(diagram => {
    //   this.diagram = diagram;
    //   this.notifyViewAboutChanges();
    // });

    dataSource.dataChanged(diagram => {
      this.diagram = diagram;
      this.notifyViewAboutChanges();
    });
  }

  attachView = (baseView: BaseView): void => {
    this.baseView = baseView;
  };

  detachView = (): void => {
    this.baseView = undefined;
  };

  onRefreshClick() {
    this.dataSource.refresh();
  }

  private notifyViewAboutChanges = (): void => {
    if (this.baseView) {
      this.baseView.onViewModelChanged();
    }
  };
}
