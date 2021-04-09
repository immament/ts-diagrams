import {Button, PageHeader} from 'antd';
import React from 'react';
import serviceContainer from '../../../common/ServiceContainer';
import {VscodeDiagramDataSourceImpl} from '../../../data/VscodeDiagramDataSource';
import Joint from '../../joint/Joint';
import {DiagramController} from '../DiagramController';
import {ShowDiagramInteractor} from '../interactors/ShowDiagram';
import {DiagramDataSource} from '../repository/DiagramDataSource';
import {DiagramAppViewModel} from './DiagramAppViewModel';
import {DiagramPresenter} from './DiagramPresenter';
import {BaseComponentProps, withSubscription} from './withSubscription';

// TODO: move to bootstrap
serviceContainer.set('DiagramDataSource', new VscodeDiagramDataSourceImpl());

export type DiagramAppProps = BaseComponentProps<
  DiagramAppViewModel,
  DiagramController
>;

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

export default withSubscription(DiagramAppComponent, createController());

function createController() {
  const diagramDataSource = serviceContainer.getOrThrow<DiagramDataSource>(
    'DiagramDataSource'
  );

  const interactor = new ShowDiagramInteractor(
    diagramDataSource,
    new DiagramPresenter()
  );

  return new DiagramController(interactor);
}
