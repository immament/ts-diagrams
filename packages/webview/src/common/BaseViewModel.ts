import BaseView from './BaseView';

export interface BaseViewModel {
  attachView(baseView: BaseView): void;
  detachView(): void;
}
