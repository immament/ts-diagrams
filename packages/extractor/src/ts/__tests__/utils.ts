import {ProjectOptions, SourceFile} from 'ts-morph';
import {ClassDiagramBuilder} from '../ClassDiagramBuilder';
import {Searcher} from '../searcher';
import {ClassDiagramTestWrapper} from './ClassDiagramTestWrapper';
import {initProject, initProjectWithFiles} from './initProject';

// function isClassLikeElement(el: DiagramElement): el is ClassLikeElement {
//   return ['Class', 'Interface'].includes(el.kind);
// }

// function isClassElement(el: DiagramElement): el is ClassElement {
//   return 'Class' === el.kind;
// }

// export function getFirstMethod(diagram: ClassDiagram) {
//   return diagram
//     .getElements()
//     .find<ClassLikeElement>(isClassLikeElement)
//     ?.getMethods()[0];
// }
// export function getFirstMethodOrThrow(diagram: ClassDiagram) {
//   return throwUndefined(getFirstMethod(diagram));
// }

// export function getFirstPropertyOrThrow(diagram: ClassDiagram) {
//   return throwUndefined(getFirstProperty(diagram));
// }

// export function getFirstProperty(diagram: ClassDiagram) {
//   return diagram
//     .getElements()
//     .find<ClassLikeElement>(isClassLikeElement)
//     ?.getProperties()[0];
// }

// export function getFirstAccessorOrThrow(diagram: ClassDiagram) {
//   return throwUndefined(getFirstAccessor(diagram));
// }

// export function getFirstAccessor(diagram: ClassDiagram) {
//   return getFirstClassElement(diagram)?.getAccessors()[0];
// }

// export function getFirstClassElement(diagram: ClassDiagram) {
//   return diagram.getElements().find<ClassElement>(isClassElement);
// }

// export function getFirstClassElementOrThrow(diagram: ClassDiagram) {
//   return throwUndefined(getFirstClassElement(diagram));
// }

// export function getFirstClassLikeElementOrThrow(diagram: ClassDiagram) {
//   return throwUndefined(getFirstClassLikeElement(diagram));
// }

// export function getFirstClassLikeElement(diagram: ClassDiagram) {
//   return diagram.getElements().find<ClassLikeElement>(isClassLikeElement);
// }

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
