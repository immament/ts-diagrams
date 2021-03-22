import {ClassDiagramDTO} from '../../../../common/src';
import BaseView from '../../common/BaseView';
import {DiagramAppViewModelIml} from '../DiagramAppViewModelImpl';
import {DiagramDataSource} from '../DiagramDataSource';
import {DiagramDataSourceMock} from './DiagramDataSourceMock';

describe('DiagramAppViewModel', () => {
  test('should listen diagram message and notify view', done => {
    const dataSource = new DiagramDataSourceMock();

    const viewModel = new DiagramAppViewModelIml(dataSource);

    const view: BaseView = {
      onViewModelChanged: () => {
        expect(viewModel.diagram).toBeDefined();
        done();
      },
    };
    viewModel.attachView(view);

    dataSource.notifyDataChanged({} as ClassDiagramDTO);
  });

  test('should refresh data source', () => {
    const dataSource: DiagramDataSource = {
      refresh: jest.fn(),
      dataChanged: jest.fn(),
    };

    const viewModel = new DiagramAppViewModelIml(dataSource);

    viewModel.onRefreshClick();

    expect(dataSource.refresh).toHaveBeenCalledTimes(1);
  });
});
