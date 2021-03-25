import {ClassDiagramDTO} from 'common';

export interface DiagramDataSource {
  refresh(): void;
  dataChanged(cb: (diagram?: ClassDiagramDTO) => void): void;
}
