import {DiagramDataSource, diagramDataSourceKey} from './DiagramDataSource';
import {DiagramDataSourceProxy} from './DiagramDataSourceProxy';
import serviceContainer from './globalServiceContainer';

export function getDiagramDataSource() {
  return (
    serviceContainer.get<DiagramDataSource>(diagramDataSourceKey) ??
    new DiagramDataSourceProxy(
      serviceContainer.wait<DiagramDataSource>(diagramDataSourceKey)
    )
  );
}
