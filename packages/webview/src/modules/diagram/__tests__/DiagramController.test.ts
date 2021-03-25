import {DiagramController} from '../DiagramController';
import {ShowDiagramInteractor} from '../interactors/ShowDiagram';
import {DiagramPresenter} from '../view/DiagramPresenter';
import {DiagramDataSourceMock} from './DiagramDataSourceMock';

describe('DiagramController', () => {
  // TODO
  test.todo('should... onRefreshClick');

  test('should create view model', () => {
    const dataSource = new DiagramDataSourceMock();

    const presenter = new DiagramPresenter();

    const controller = new DiagramController(
      new ShowDiagramInteractor(dataSource, presenter)
    );

    const presenterResult = controller.getPresenter();

    expect(presenterResult).toBeDefined();
  });
});
