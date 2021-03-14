import {VariableDeclaration} from 'ts-morph';
import {VariableElement} from '../result/ClassDiagram';
import {ElementBuilder} from './ElementBuilder';
import {getTypeText} from './ts-utils';

export class VariableElementBuilder implements ElementBuilder {
  create(declaration: VariableDeclaration): VariableElement {
    return new VariableElement(
      declaration.getName() ?? 'no-name',
      getTypeText(declaration.getType())
    );
  }
}
