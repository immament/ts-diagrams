import {BaseViewModel} from 'webview/src/common/BaseViewModel';
import {ShowDiagramInteractor} from './interactors/ShowDiagram';
import {DiagramAppViewModel} from './view/DiagramAppViewModel';
import {Presenter} from './view/Presenter';

export interface ViewController<M extends BaseViewModel> {
  getPresenter(): Presenter<M>;
}

export class DiagramController implements ViewController<DiagramAppViewModel> {
  constructor(private showDiagram: ShowDiagramInteractor) {}

  getPresenter() {
    return this.showDiagram.getPresenter();
  }

  onRefreshClick() {
    this.showDiagram.refresh();
  }
}
