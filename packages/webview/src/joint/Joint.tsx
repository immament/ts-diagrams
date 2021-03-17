import React, {useEffect, useState} from 'react';

import './Joint.css';

import 'jointjs/dist/joint.css';
import {diagram} from './diagram';
import {DiagramSkeleton} from '../diagram/DiagramSkeleton';

function Joint() {
  const el = React.createRef<HTMLDivElement>();
  const [skeleton, setSkeleton] = useState<DiagramSkeleton | undefined>(
    undefined
  );
  useEffect(() => {
    window.addEventListener(
      'message',
      (event: MessageEvent<{command: string; diagram?: DiagramSkeleton}>) => {
        const message = event.data;
        if (message.command === 'diagram') {
          setSkeleton(message.diagram);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (el.current && skeleton) {
      diagram(el.current, {skeleton});
    }
  }, [el, skeleton]);

  return (
    <div id="paper-container">
      <div ref={el} id="diagram-root"></div>
    </div>
  );
}

export default Joint;
