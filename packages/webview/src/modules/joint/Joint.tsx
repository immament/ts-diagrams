import React, {useEffect, useState} from 'react';

import './Joint.css';

import 'jointjs/dist/joint.css';
import {createDiagram, JoindClassDiagram} from './createDiagram';
import {ClassDiagramDTO} from 'common';

function Joint({diagram}: {diagram?: ClassDiagramDTO}) {
  console.log('+Joint');
  const el = React.createRef<HTMLDivElement>();

  const [jointDiagram, setJointDiagram] = useState<
    JoindClassDiagram | undefined
  >();

  useEffect(() => {
    if (el.current && diagram) {
      console.log('+Joint - useEffect', diagram);
      jointDiagram?.dispose();
      setJointDiagram(createDiagram(el.current, {diagram}));
    }

    return () => {
      console.log('+Joint - dispose');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el.current, diagram]);

  return (
    <div id="paper-container">
      <div ref={el} id="diagram-root"></div>
    </div>
  );
}

export default Joint;
