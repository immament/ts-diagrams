import {ClassDiagramDTO} from '../../../common/src';
import {DiagramChangedMessage, DiagramMessage} from './DiagramMessage';

export interface DiagramDataSource {
  refresh(): void;
  dataChanged(cb: (diagram?: ClassDiagramDTO) => void): void;
}

interface ExternalDataSource {
  refresh(): void;
}

export class DiagramDataSourceImpl implements DiagramDataSource {
  private externalDataSource?: ExternalDataSource;

  refresh(): void {
    this.externalDataSource?.refresh();
  }

  dataChanged(cb: (diagram?: ClassDiagramDTO) => void): void {
    window.addEventListener(
      'message',
      (event: MessageEvent<DiagramMessage>) => {
        const message = event.data;
        if (message.command === 'diagram') {
          cb((message as DiagramChangedMessage).diagram);
        } else if (message.command === 'init') {
          this.externalDataSource = (message as any).externalDataSource;
        }
      }
    );
  }
}
