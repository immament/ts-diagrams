import {
  ClassDiagram,
  ClassElement,
  ClassLikeElement,
  DiagramElement,
  FunctionElement,
  VariableElement,
} from '../../../result/ClassDiagram';
import {throwUndefined} from './utils';

export class ClassDiagramTestWrapper {
  constructor(private diagram: ClassDiagram) {}

  getElements() {
    return this.diagram.getElements();
  }

  // Class like
  getFirstClassLikeElementOrThrow() {
    return throwUndefined(this.getFirstClassLikeElement());
  }

  getFirstClassLikeElement() {
    return this.diagram.getElements().find(this.isClassLikeElement);
  }

  isClassLikeElement(el: DiagramElement): el is ClassLikeElement {
    return ['Class', 'Interface'].includes(el.kind);
  }

  getFirstMethod() {
    return this.getFirstClassLikeElement()?.getMethods()[0];
  }

  getFirstMethodOrThrow() {
    return throwUndefined(this.getFirstMethod());
  }

  getFirstPropertyOrThrow() {
    return throwUndefined(this.getFirstProperty());
  }

  getFirstProperty() {
    return this.getFirstClassLikeElement()?.getProperties()[0];
  }

  // Class

  getFirstClassElementOrThrow() {
    return throwUndefined(this.getFirstClassElement());
  }

  getFirstClassElement() {
    return this.diagram.getElements().find(this.isClassElement);
  }

  isClassElement(el: DiagramElement): el is ClassElement {
    return 'Class' === el.kind;
  }

  getFirstAccessorOrThrow() {
    return throwUndefined(this.getFirstAccessor());
  }

  getFirstAccessor() {
    return this.getFirstClassElement()?.getAccessors()[0];
  }

  // Function

  getFirstFunctionElementOrThrow() {
    return throwUndefined(this.getFirstFunctionElement());
  }

  getFirstFunctionElement() {
    return this.diagram.getElements().find(this.isFunctionElement);
  }

  isFunctionElement(el: DiagramElement): el is FunctionElement {
    return 'Function' === el.kind;
  }

  // Variables

  getFirstVariableElementOrThrow() {
    return throwUndefined(this.getFirstVariableElement());
  }

  getFirstVariableElement() {
    return this.diagram.getElements().find(this.isVariableElement);
  }

  isVariableElement(el: DiagramElement): el is VariableElement {
    return 'Variable' === el.kind;
  }
}
