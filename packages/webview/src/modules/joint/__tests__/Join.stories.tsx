/* eslint-disable node/no-unpublished-import */
import {Meta, Story} from '@storybook/react';
import {ClassDiagramDTO} from 'common';
import React from 'react';
import Joint from '../Joint';
import {createSampleDiagramDTO} from './sampleJointDiagram';
// eslint-disable-next-line node/no-unpublished-import

export default {
  title: 'Diagram/Joint',
  component: Joint,
  argTypes: {},
} as Meta;

const Template: Story<{diagram?: ClassDiagramDTO}> = ({...args}) => {
  return <Joint {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  diagram: createSampleDiagramDTO(),
};
