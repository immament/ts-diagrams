import {ClassDiagramDTO} from '../../../common/src';

export interface DiagramMessage {
  command: string;
}

export interface DiagramChangedMessage extends DiagramMessage {
  command: 'diagram';
  diagram: ClassDiagramDTO;
}
