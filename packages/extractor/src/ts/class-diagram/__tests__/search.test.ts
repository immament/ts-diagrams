import {initProject} from '../../__tests__/initProject';
import {ClassDiagramElementsSearcher} from '../ClassDiagramElementsSearcher';

describe('ClassDiagramElementsSearcher', () => {
  test('should find nothing', () => {
    const {sourceFile} = initProject('interface A {}');
    const searcher = new ClassDiagramElementsSearcher();
    expect(searcher.search(sourceFile)).toHaveLength(0);
  });

  test('should find class Declaration', () => {
    const {sourceFile} = initProject('export class A {}');

    const searcher = new ClassDiagramElementsSearcher();
    expect(searcher.search(sourceFile)).toHaveLength(1);
  });

  test('should ignore not exported', () => {
    const {sourceFile} = initProject('class B {}');

    const searcher = new ClassDiagramElementsSearcher({
      checkOnlyExportKeyword: true,
    });
    expect(searcher.search(sourceFile)).toHaveLength(0);
  });

  test('should find exported alias', () => {
    const {sourceFile} = initProject(' class B {} export {B};');
    const searcher = new ClassDiagramElementsSearcher();
    expect(searcher.search(sourceFile)).toHaveLength(1);
  });
});
