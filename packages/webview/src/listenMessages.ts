import {ClassDiagramDTO} from '../../common/src';

export function listenMessages(cb: (diagram?: ClassDiagramDTO) => void) {
  window.addEventListener(
    'message',
    (event: MessageEvent<{command: string; diagram?: ClassDiagramDTO}>) => {
      const message = event.data;
      if (message.command === 'diagram') {
        cb(message.diagram);
      }
    }
  );
}
