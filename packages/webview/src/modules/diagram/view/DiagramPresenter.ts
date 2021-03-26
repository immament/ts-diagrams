import {ClassDiagramDTO} from 'common';
import BaseView from '../../../common/BaseView';
import {DiagramAppViewModel} from './DiagramAppViewModel';

export class DiagramPresenter {
  private baseView?: BaseView<DiagramAppViewModel>;

  show({diagram}: {diagram?: ClassDiagramDTO}): void {
    this.baseView?.onViewModelChanged({diagram});
  }

  attachView = (baseView: BaseView<DiagramAppViewModel>): void => {
    this.baseView = baseView;
  };

  detachView = (): void => {
    this.baseView = undefined;
  };
}
