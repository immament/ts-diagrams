// eslint-disable-next-line node/no-unpublished-import
import {expect} from 'chai';
import {DiagramBuilderDemo} from '../DiagramBuilderDemo';

describe('DiagramBuilder', () => {
  it('should create diagram from memory', () => {
    const builder = new DiagramBuilderDemo();

    const diagram = builder.create();
    expect(diagram.elements).length(3);
  });
});
