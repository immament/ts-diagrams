import {DiagramController} from '../DiagramController';
import {ShowDiagramInteractor} from '../interactors/ShowDiagram';
import {DiagramPresenter} from '../view/DiagramPresenter';
import {DiagramDataSourceMock} from './DiagramDataSourceMock';

describe('DiagramController', () => {
  let showDiagramInteractor: ShowDiagramInteractor;
  let dataSource: DiagramDataSourceMock;

  beforeEach(() => {
    dataSource = new DiagramDataSourceMock();
    const presenter = new DiagramPresenter();
    showDiagramInteractor = new ShowDiagramInteractor(dataSource, presenter);
  });

  test('should getPresenter return presenter', () => {
    const controller = new DiagramController(showDiagramInteractor);

    const presenterResult = controller.getPresenter();

    expect(presenterResult).toBeTruthy();
  });

  test('should refresh call data source', () => {
    const controller = new DiagramController(showDiagramInteractor);

    controller.onRefreshClick();

    expect(dataSource.refresh).toBeCalled();
  });

  test('should listen data source changes', () => {
    const controller = new DiagramController(showDiagramInteractor);
    const presenter = controller.getPresenter();
    const onViewModelChangedSpy = jest.fn();

    presenter.attachView({onViewModelChanged: onViewModelChangedSpy});
    dataSource.notifyDataChanged({elements: [], links: []});
    dataSource.notifyDataChanged({elements: [], links: []});

    expect(onViewModelChangedSpy).toHaveBeenCalledTimes(2);
  });
});
