import {Button, PageHeader} from 'antd';
import React, {useEffect, useState} from 'react';
import {ClassDiagramDTO} from '../../../common/src';
import {DiagramAppViewModel} from './DiagramAppViewModel';
import Joint from './Joint';

function DiagramApp({viewModel}: {viewModel: DiagramAppViewModel}) {
  const [diagram, setDiagram] = useState<ClassDiagramDTO | undefined>(
    viewModel.diagram
  );

  useEffect(() => {
    const currentViewModel = viewModel;
    currentViewModel?.attachView({
      onViewModelChanged: () => setDiagram(viewModel.diagram),
    });
    return () => {
      currentViewModel?.detachView();
    };
  }, [viewModel]);

  return (
    <>
      <PageHeader
        className="class-diagram-header"
        title="Class diagram"
        subTitle="This is a subtitle"
        extra={[
          <Button key="1" onClick={() => viewModel.onRefreshClick()}>
            Refresh
          </Button>,
        ]}
      ></PageHeader>
      <Joint diagram={diagram}></Joint>
    </>
  );
}

export default DiagramApp;
