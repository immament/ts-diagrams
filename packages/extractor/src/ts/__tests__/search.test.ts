import {Searcher} from '../searcher';
import {initProject} from './initProject';

describe('Search', () => {
  test('should find nothing', () => {
    const {sourceFile} = initProject('export interface A {}');
    const searcher = new Searcher();
    expect(searcher.search(sourceFile)).toHaveLength(0);
  });

  test('should find class Declaration', () => {
    const {sourceFile} = initProject('export class A {}');

    const searcher = new Searcher();
    expect(searcher.search(sourceFile)).toHaveLength(1);
  });

  test('should ignore not exported', () => {
    const {sourceFile} = initProject('class B {}');

    const searcher = new Searcher({checkOnlyExportKeyword: true});
    expect(searcher.search(sourceFile)).toHaveLength(0);
  });

  test('should find exported alias', () => {
    const {sourceFile} = initProject(' class B {} export {B};');
    const searcher = new Searcher();
    expect(searcher.search(sourceFile)).toHaveLength(1);
  });
});
