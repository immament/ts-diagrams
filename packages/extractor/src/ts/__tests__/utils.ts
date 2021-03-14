import {ProjectOptions, SourceFile} from 'ts-morph';
import {ClassDiagram} from '../../result/ClassDiagram';
import {ClassDiagramBuilder} from '../ClassDiagramBuilder';
import {Searcher} from '../searcher';
import {initProject, initProjectWithFiles} from './initProject';

export function getFirstMethod(diagram: ClassDiagram) {
  return diagram.getElements()[0].getMethods()[0];
}
export function getFirstProperty(diagram: ClassDiagram) {
  return diagram.getElements()[0].getProperties()[0];
}
export function getFirstAccessor(diagram: ClassDiagram) {
  return diagram.getElements()[0].getAccessors()[0];
}
export function createDiagram(fileContent: string) {
  const builder = new ClassDiagramBuilder();
  return builder.create({declarations: initElements(fileContent)});
}

export function createDiagramWithLoadLibs(fileContent: string) {
  const builder = new ClassDiagramBuilder();
  return builder.create({
    declarations: initElements(fileContent, {skipLoadingLibFiles: false}),
  });
}

export function createDiagramFromFiles(files: [string, string][]) {
  const builder = new ClassDiagramBuilder();
  return builder.create({declarations: initElementsWithFiles(files)});
}

function initElements(fileContent: string, opt: ProjectOptions = {}) {
  const {sourceFile} = initProject(fileContent, opt);
  return search(sourceFile);
}

function initElementsWithFiles(files: [string, string][]) {
  const {firstFile} = initProjectWithFiles(files);
  expect(firstFile).toBeDefined();
  return search(firstFile!);
}

function search(sourceFile: SourceFile) {
  const searcher = new Searcher({checkOnlyExportKeyword: true});
  return searcher.search(sourceFile);
}
