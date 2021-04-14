import {ClassDiagramDTO} from 'common';

function Joint({diagram}: {diagram?: ClassDiagramDTO}) {
  return <div id="paper-container">{JSON.stringify(diagram)}</div>;
}

export default Joint;
