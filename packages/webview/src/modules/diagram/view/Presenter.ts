import BaseView from '../../../common/BaseView';

export abstract class Presenter<M> {
  private baseView?: BaseView<M>;

  show(model: M): void {
    this.baseView?.onViewModelChanged(model);
  }

  attachView(baseView: BaseView<M>): void {
    this.baseView = baseView;
  }

  detachView(): void {
    this.baseView = undefined;
  }
}
