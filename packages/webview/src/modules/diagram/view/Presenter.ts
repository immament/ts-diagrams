import BaseView from '../../../common/BaseView';

export abstract class Presenter<M> {
  protected view?: BaseView<M>;

  show(model: M): void {
    this.view?.onViewModelChanged(model);
  }

  attachView(view: BaseView<M>): void {
    // console.log('attachView', view);
    this.view = view;
  }

  detachView(): void {
    this.view = undefined;
  }
}
