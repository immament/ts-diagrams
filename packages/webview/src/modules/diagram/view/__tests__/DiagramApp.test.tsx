/* eslint-disable import/first */

import mockDataSource from '../../__tests__/DiagramDataSourceMock';

import {ClassDiagramDTO, DiagramElementDTO} from 'common';
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {DiagramController} from '../../DiagramController';

import DiagramApp, {DiagramAppComponent} from '../DiagramApp';
import {DiagramAppViewModel} from '../DiagramAppViewModel';

jest.mock('../../../joint/Joint');
jest.mock('../../repository/DiagramDataSource', () => ({
  getDiagramDataSource: () => mockDataSource,
}));

describe('DiagramAppComponent', () => {
  let container: HTMLDivElement | undefined;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = undefined;
    }
  });

  test('should render', () => {
    const viewModel = {};
    const controller = (jest.fn() as unknown) as DiagramController;

    act(() => {
      render(
        <DiagramAppComponent viewModel={viewModel} controller={controller} />,
        container!
      );
    });
    expect(container?.textContent).toContain('Class diagram');
  });

  test('should render with subscribtion', () => {
    act(() => {
      render(<DiagramApp />, container!);
    });
    expect(container?.textContent).toContain('Class diagram');
  });

  test('should render diagram element', () => {
    const viewModel: DiagramAppViewModel = {
      diagram: {
        elements: [{name: 'diagramElement01'} as DiagramElementDTO],
        links: [],
      },
    };
    const controller = (jest.fn() as unknown) as DiagramController;

    act(() => {
      render(
        <DiagramAppComponent viewModel={viewModel} controller={controller} />,
        container!
      );
    });
    expect(container?.textContent).toContain('diagramElement01');
  });

  test('should render diagram element changes', () => {
    const diagram1: ClassDiagramDTO = {
      elements: [{name: 'diagramElement01'} as DiagramElementDTO],
      links: [],
    };

    act(() => {
      render(<DiagramApp />, container!);
    });

    act(() => {
      mockDataSource.notifyDataChanged(diagram1);
    });

    expect(container?.textContent).toContain('diagramElement01');

    const diagram2: ClassDiagramDTO = {
      elements: [{name: 'diagramElement02'} as DiagramElementDTO],
      links: [],
    };

    act(() => {
      mockDataSource.notifyDataChanged(diagram2);
    });

    expect(container?.textContent).toContain('diagramElement02');

    expect(container?.textContent).not.toContain('diagramElement01');
  });
});
