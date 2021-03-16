// eslint-disable-next-line node/no-unpublished-import
import {expect} from 'chai';
import {Extractor} from '../Extractor';

describe('Extractor', () => {
  it('should create diagram', () => {
    const extractor = new Extractor();

    const diagram = extractor.extract();
    expect(diagram.elements).length(1);
  });
});
