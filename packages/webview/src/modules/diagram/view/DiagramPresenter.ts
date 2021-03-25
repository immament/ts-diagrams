import {ClassDiagramDTO} from 'common';
import BaseView from '../../../common/BaseView';
import {DiagramAppViewModelIml} from './DiagramAppViewModelImpl';

export class DiagramPresenter {
  private baseView?: BaseView<DiagramAppViewModelIml>;

  show({diagram}: {diagram?: ClassDiagramDTO}): void {
    this.baseView?.onViewModelChanged(new DiagramAppViewModelIml(diagram));
  }

  attachView = (baseView: BaseView<DiagramAppViewModelIml>): void => {
    this.baseView = baseView;
  };

  detachView = (): void => {
    this.baseView = undefined;
  };
}
