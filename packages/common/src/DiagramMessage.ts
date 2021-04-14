/* istanbul ignore file */
import {ClassDiagramDTO} from '.';

export interface DiagramMessage {
  command: string;
}

export interface DiagramChangedMessage extends DiagramMessage {
  command: 'diagram';
  diagram: ClassDiagramDTO;
}