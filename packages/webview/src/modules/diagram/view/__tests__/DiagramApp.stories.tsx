import React from 'react';
// eslint-disable-next-line node/no-unpublished-import
import {Story, Meta} from '@storybook/react';
import {DiagramDataSource} from '../../repository/DiagramDataSource';
import {DiagramDataSourceMock} from '../../__tests__/DiagramDataSourceMock';
import {DiagramAppComponent, DiagramAppProps} from '../DiagramApp';
import {createSampleDiagramDTO} from '../../../joint/__tests__/sampleJointDiagram';

import {DiagramController} from '../../DiagramController';
import {ShowDiagramInteractor} from '../../interactors/ShowDiagram';
import {DiagramPresenter} from '../DiagramPresenter';

export default {
  title: 'Diagram/DiagramApp',
  component: DiagramAppComponent,
  argTypes: {},
} as Meta;

const diagramDataSource: DiagramDataSource = new DiagramDataSourceMock();

const Template: Story<DiagramAppProps> = ({...args}) => {
  return <DiagramAppComponent {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  //viewModel: new DiagramAppViewModelIml(createSampleDiagramDTO()),
  controller: new DiagramController(
    new ShowDiagramInteractor(diagramDataSource, new DiagramPresenter())
  ),
};
