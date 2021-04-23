window.onload = () => {
  const dataSourceMock = {
    dataChanged(cb) {
      this.resolve?.();
      this.dataChangedCallback = cb;
    },

    waitForCallback() {
      return new Promise(resolve => (this.resolve = resolve));
    },

    refresh() {},

    notifyDataChanged(diagram) {
      this.dataChangedCallback(diagram);
    },
  };
  window.ServiceContainer.set('DiagramDataSource', dataSourceMock);

  dataSourceMock
    .waitForCallback()
    .then(() => dataSourceMock.notifyDataChanged(diagramDTO));
};

const diagramDTO = {
  elements: [
    {
      id: '1',
      kind: 'uml.Class',
      name: 'User',
      properties: [{name: 'id', accessModifier: 'public', type: 'string'}],
    },
    {
      id: '2',
      kind: 'uml.Interface',
      name: 'Entity',
      methods: [{name: 'remove', accessModifier: 'public', parameters: []}],
    },
  ],
  links: [{fromId: '1', toId: '2', kind: 'uml.Generalization'}],
};
