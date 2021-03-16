import React, {useEffect} from 'react';

import './Joint.css';

import 'jointjs/dist/joint.css';
import {diagram} from './diagram';

function Joint() {
  const el = React.createRef<HTMLDivElement>();

  useEffect(() => {
    window.addEventListener('message', event => {
      const message = event.data;
      console.log('A key was pressed', message);
      if (el.current) diagram(el.current, {skeleton: message.diagram});
    });
  }, [el]);

  return (
    <div id="paper-container">
      <div></div>
      <div ref={el} id="diagram-root"></div>
    </div>
  );
}

export default Joint;
