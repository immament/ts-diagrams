import {VariableElement} from '@common/ClassDiagram';
import {VariableDeclaration} from 'ts-morph';
import {getTypeText} from '../utils/ts-utils';
import {ElementBuilder} from './ElementBuilder';

export class VariableElementBuilder implements ElementBuilder {
  create(declaration: VariableDeclaration): VariableElement {
    return new VariableElement(
      declaration.getName() ?? 'no-name',
      getTypeText(declaration.getType())
    );
  }
}
