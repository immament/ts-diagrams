import * as assert from 'assert';

describe('Other test', () => {
  it('Otest 2', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});
