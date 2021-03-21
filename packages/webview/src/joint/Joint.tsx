import React, {useEffect} from 'react';

import './Joint.css';

import 'jointjs/dist/joint.css';
import {createDiagram} from './diagram';
import {ClassDiagramDTO} from '../../../common/src';

function Joint({diagram}: {diagram?: ClassDiagramDTO}) {
  const el = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (el.current && diagram) {
      createDiagram(el.current, {diagram});
    }
  }, [el, diagram]);

  return (
    <div id="paper-container">
      <div ref={el} id="diagram-root"></div>
    </div>
  );
}

export default Joint;
