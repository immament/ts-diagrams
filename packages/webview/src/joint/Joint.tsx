import React, {useEffect} from 'react';

import './Joint.css';

import 'jointjs/dist/joint.css';
import {sampleDiagram} from './sampleDiagram';

function Joint() {
  const el = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (el.current) sampleDiagram(el.current);
  }, [el]);

  return (
    <div id="paper-container">
      <div ref={el} id="diagram-root"></div>
    </div>
  );
}

export default Joint;
