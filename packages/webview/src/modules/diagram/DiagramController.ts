import {ShowDiagramInteractor} from './interactors/ShowDiagram';

export class DiagramController {
  constructor(private showDiagram: ShowDiagramInteractor) {}

  getPresenter() {
    return this.showDiagram.getPresenter();
  }

  onRefreshClick() {
    this.showDiagram.refresh();
  }
}
