import {Button, PageHeader} from 'antd';
import React, {useEffect, useState} from 'react';
import myContainer from '../../../common/MyContainer';
import {VscodeDiagramDataSourceImpl} from '../../../data/VscodeDiagramDataSource';
import Joint from '../../joint/Joint';
import {DiagramController} from '../DiagramController';
import {ShowDiagramInteractor} from '../interactors/ShowDiagram';
import {DiagramDataSource} from '../repository/DiagramDataSource';
import {DiagramAppViewModel} from './DiagramAppViewModel';
import {DiagramPresenter} from './DiagramPresenter';

export type DiagramAppProps = {
  viewModel: DiagramAppViewModel;
  controller: DiagramController;
};

export function DiagramAppComponent({viewModel, controller}: DiagramAppProps) {
  return (
    <>
      <PageHeader
        className="class-diagram-header"
        title="Class diagram"
        subTitle="todo.."
        extra={[
          <Button key="1" onClick={() => controller.onRefreshClick()}>
            Refresh
          </Button>,
        ]}
      ></PageHeader>
      <Joint diagram={viewModel.diagram}></Joint>
    </>
  );
}

export default withSubscription(DiagramAppComponent);

function withSubscription(Component: (props: DiagramAppProps) => JSX.Element) {
  return function () {
    const [viewModel, setViewModel] = useState<DiagramAppViewModel>({});
    const [controller] = useState<DiagramController>(createController());

    useEffect(() => {
      const presenter = controller.getPresenter();

      presenter.attachView({
        onViewModelChanged: viewModel => setViewModel(viewModel),
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

myContainer.set('DiagramDataSource', new VscodeDiagramDataSourceImpl());

function createController() {
  const diagramDataSource = myContainer.getOrThrow<DiagramDataSource>(
    'DiagramDataSource'
  );

  const interactor = new ShowDiagramInteractor(
    diagramDataSource,
    new DiagramPresenter()
  );

  return new DiagramController(interactor);
}
