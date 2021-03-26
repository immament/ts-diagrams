import {ProjectOptions, SourceFile} from 'ts-morph';
import {initProject, initProjectWithFiles} from '../../initProject';
import {ClassDiagramBuilder} from '../ClassDiagramBuilder';
import {Searcher} from '../searcher';
import {ClassDiagramTestWrapper} from './ClassDiagramTestWrapper';

export function createDiagram(fileContent: string) {
  const builder = new ClassDiagramBuilder();
  return new ClassDiagramTestWrapper(
    builder.create({declarations: initElements(fileContent)})
  );
}

export function createDiagramWithLoadLibs(fileContent: string) {
  const builder = new ClassDiagramBuilder();
  return new ClassDiagramTestWrapper(
    builder.create({
      declarations: initElements(fileContent, {skipLoadingLibFiles: false}),
    })
  );
}

export function createDiagramFromFiles(files: [string, string][]) {
  const builder = new ClassDiagramBuilder();
  return new ClassDiagramTestWrapper(
    builder.create({declarations: initElementsWithFiles(files)})
  );
}

export function initElements(fileContent: string, opt: ProjectOptions = {}) {
  const {sourceFile} = initProject(fileContent, opt);
  return search(sourceFile);
}

export function initElementsWithFiles(files: [string, string][]) {
  const {firstFile} = initProjectWithFiles(files);
  expect(firstFile).toBeDefined();
  return search(firstFile!);
}

export function search(sourceFile: SourceFile) {
  const searcher = new Searcher({checkOnlyExportKeyword: true});
  return searcher.search(sourceFile);
}

export function throwUndefined<T>(value: T | undefined): T {
  if (value === undefined) throw new Error('Value is undefined');
  return value;
}
