import React, {useEffect, useState} from 'react';

import './Joint.css';

import 'jointjs/dist/joint.css';
import {createDiagram, JoindClassDiagram} from './createDiagram';
import {ClassDiagramDTO} from 'common';

function Joint({diagram}: {diagram?: ClassDiagramDTO}) {
  const el = React.createRef<HTMLDivElement>();

  const [jointDiagram, setJointDiagram] = useState<
    JoindClassDiagram | undefined
  >();

  useEffect(() => {
    if (el.current && diagram) {
      if (!jointDiagram) {
        setJointDiagram(createDiagram(el.current, {diagram}));
      }
    }

    return () => {
      jointDiagram?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el, diagram]);

  return (
    <div id="paper-container">
      <div ref={el} id="diagram-root"></div>
    </div>
  );
}

export default Joint;
