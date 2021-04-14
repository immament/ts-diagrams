import React from 'react';
// eslint-disable-next-line node/no-unpublished-import
import {Story, Meta} from '@storybook/react';
import {MockDiagramDataSource} from '../../__tests__/DiagramDataSourceMock';
import {DiagramAppComponent, DiagramAppProps} from '../DiagramApp';

import {DiagramController} from '../../DiagramController';
import {ShowDiagramInteractor} from '../../interactors/ShowDiagram';
import {DiagramPresenter} from '../DiagramPresenter';
import {DiagramDataSource} from 'common';
import {createSampleDiagramDTO} from 'webview/src/modules/joint/__tests__/sampleJointDiagram';

export default {
  title: 'Diagram/DiagramApp',
  component: DiagramAppComponent,
  argTypes: {},
} as Meta;

const diagramDataSource: DiagramDataSource = new MockDiagramDataSource();

const Template: Story<DiagramAppProps> = ({...args}) => {
  return <DiagramAppComponent {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  viewModel: {diagram: createSampleDiagramDTO()},
  controller: new DiagramController(
    new ShowDiagramInteractor(diagramDataSource, new DiagramPresenter())
  ),
};
