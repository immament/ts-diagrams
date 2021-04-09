/* istanbul ignore file */
import {ClassDiagramDTO} from 'common';

export interface DiagramMessage {
  command: string;
}

export interface DiagramChangedMessage extends DiagramMessage {
  command: 'diagram';
  diagram: ClassDiagramDTO;
}
