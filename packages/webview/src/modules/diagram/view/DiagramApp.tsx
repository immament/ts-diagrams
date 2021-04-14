import {Button, ConfigProvider, PageHeader} from 'antd';
import React from 'react';
import Joint from '../../joint/Joint';
import {DiagramController} from '../DiagramController';
import {ShowDiagramInteractor} from '../interactors/ShowDiagram';
import {getDiagramDataSource} from 'common';
import {DiagramAppViewModel} from './DiagramAppViewModel';

import {DiagramPresenter} from './DiagramPresenter';
import {BaseComponentProps, withSubscription} from './withSubscription';

export type DiagramAppProps = BaseComponentProps<
  DiagramAppViewModel,
  DiagramController
>;

export function DiagramAppComponent({viewModel, controller}: DiagramAppProps) {
  console.log('DiagramAppComponent.render');
  return (
    <>
      <PageHeader
        className="class-diagram-header"
        title="Class diagram"
        subTitle=".."
        extra={[
          <ConfigProvider csp={{nonce: 'abc'}} key="1">
            <Button onClick={() => controller.onRefreshClick()}>Refresh</Button>
          </ConfigProvider>,
        ]}
      ></PageHeader>
      <Joint diagram={viewModel.diagram}></Joint>
    </>
  );
}

export default withSubscription(DiagramAppComponent, createController());

function createController() {
  const interactor = new ShowDiagramInteractor(
    getDiagramDataSource(),
    new DiagramPresenter()
  );

  return new DiagramController(interactor);
}
