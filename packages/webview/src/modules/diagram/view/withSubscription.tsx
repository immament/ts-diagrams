import {useEffect, useState} from 'react';
import {BaseViewModel} from 'webview/src/common/BaseViewModel';
import {ViewController} from '../DiagramController';

export interface BaseComponentProps<
  M extends BaseViewModel,
  C extends ViewController<M>
> {
  viewModel: M;
  controller: C;
}

export function withSubscription<
  M extends BaseViewModel,
  C extends ViewController<M>
>(
  Component: (props: BaseComponentProps<M, C>) => JSX.Element,
  viewController: C
) {
  return function () {
    const [viewModel, setViewModel] = useState<M>({} as M);
    const [controller] = useState<C>(viewController);

    useEffect(() => {
      const presenter = controller.getPresenter();

      presenter.attachView({
        onViewModelChanged: viewModel => {
          setViewModel(viewModel);
        },
      });

      return () => {
        presenter.detachView();
      };
    }, [controller]);

    return (
      <Component viewModel={viewModel} controller={controller}></Component>
    );
  };
}
