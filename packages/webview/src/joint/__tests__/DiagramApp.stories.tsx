import React from 'react';
import {Story, Meta} from '@storybook/react';
import DiagramApp from '../DiagramApp';
import {createSampleDiagramDTO} from './sampleDiagram';
import {DiagramAppViewModelIml} from '../DiagramAppViewModelImpl';
import {ClassDiagramDTO} from '../../../../common/src';
import {DiagramDataSource} from '../DiagramDataSource';
import {DiagramDataSourceMock} from './DiagramDataSourceMock';

export default {
  title: 'Diagram/DiagramApp',
  component: DiagramApp,
  argTypes: {},
} as Meta;

const diagramDataSource: DiagramDataSource = new DiagramDataSourceMock();

const Template: Story<{viewModel: {diagram: ClassDiagramDTO}}> = ({
  viewModel,
  ...args
}) => {
  const viewModelImpl = new DiagramAppViewModelIml(
    diagramDataSource,
    viewModel?.diagram
  );
  return <DiagramApp viewModel={viewModelImpl} {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  viewModel: {diagram: createSampleDiagramDTO()},
};
