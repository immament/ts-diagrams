import React, {useEffect, useState} from 'react';
import {ClassDiagramDTO} from '../../common/src';
import './App.css';
import Joint from './joint/Joint';
import {listenMessages} from './listenMessages';

function App() {
  const [diagram, setDiagram] = useState<ClassDiagramDTO | undefined>(
    undefined
  );

  useEffect(() => {
    listenMessages(diagram => setDiagram(diagram));
  }, []);

  return (
    <div className="App">
      <Joint diagram={diagram}></Joint>
    </div>
  );
}

export default App;
