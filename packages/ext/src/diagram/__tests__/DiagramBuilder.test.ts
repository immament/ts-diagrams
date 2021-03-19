// eslint-disable-next-line node/no-unpublished-import
import {expect} from 'chai';
import {DiagramBuilder} from '../DiagramBuilder';

describe('DiagramBuilder', () => {
  it('should create diagram from memory', () => {
    const builder = new DiagramBuilder();

    const diagram = builder.createDemo();
    expect(diagram.elements).length(3);
  });
});
