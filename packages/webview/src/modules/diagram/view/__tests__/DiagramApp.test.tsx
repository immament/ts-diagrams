import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {DiagramController} from '../../DiagramController';

import DiagramApp, {DiagramAppComponent} from '../DiagramApp';

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

  test('shound render', () => {
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
});
