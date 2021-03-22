import React, {useEffect} from 'react';

import './App.css';
import DiagramApp from './joint/DiagramApp';

import 'antd/dist/antd.css';
import {DiagramAppViewModelIml} from './joint/DiagramAppViewModelImpl';
import {DiagramAppViewModel} from './joint/DiagramAppViewModel';
import {DiagramDataSourceImpl} from './joint/DiagramDataSource';

function App() {
  const viewModel: DiagramAppViewModel = new DiagramAppViewModelIml(
    new DiagramDataSourceImpl()
  );

  useEffect(() => {}, []);

  return (
    <div className="App">
      <DiagramApp viewModel={viewModel}></DiagramApp>
    </div>
  );
}

export default App;
