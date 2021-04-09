/* istanbul ignore file */
import React, {useEffect} from 'react';

import './App.css';
import DiagramAppComponent from './modules/diagram/view/DiagramApp';

import 'antd/dist/antd.css';

function App() {
  useEffect(() => {}, []);

  return (
    <div className="App">
      <DiagramAppComponent></DiagramAppComponent>
    </div>
  );
}

export default App;
