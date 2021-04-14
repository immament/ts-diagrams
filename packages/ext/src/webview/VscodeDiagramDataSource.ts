import {
  ClassDiagramDTO,
  DiagramChangedMessage,
  DiagramDataSource,
  DiagramMessage,
} from 'common';

export class VscodeDiagramDataSourceImpl implements DiagramDataSource {
  refresh(): void {
    // TODO
  }

  dataChanged(cb: (diagram?: ClassDiagramDTO) => void): void {
    window.addEventListener(
      'message',
      (event: MessageEvent<DiagramMessage>) => {
        const message = event.data;
        if (message.command === 'diagram') {
          cb((message as DiagramChangedMessage).diagram);
        }
      }
    );
  }
}
