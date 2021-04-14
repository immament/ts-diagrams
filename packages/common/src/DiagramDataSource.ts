/* istanbul ignore file */
import {ClassDiagramDTO} from './ClassDiagram';
export const diagramDataSourceKey = 'DiagramDataSource';

export interface DiagramDataSource {
  refresh(): void;
  dataChanged(cb: (diagram?: ClassDiagramDTO) => void): void;
}
