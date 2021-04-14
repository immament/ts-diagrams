import {ViewController} from '../DiagramController';
import {ShowDiagramInteractor} from '../interactors/ShowDiagram';
import {DiagramAppViewModel} from '../view/DiagramAppViewModel';

export class DiagramController implements ViewController<DiagramAppViewModel> {
  constructor(private showDiagram: ShowDiagramInteractor) {}

  getPresenter() {
    return this.showDiagram.getPresenter();
  }

  onRefreshClick() {
    this.showDiagram.refresh();
  }
}
