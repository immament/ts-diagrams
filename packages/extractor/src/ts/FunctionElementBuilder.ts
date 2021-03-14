import {FunctionDeclaration, ParameteredNode} from 'ts-morph';
import {FunctionElement} from '../result/ClassDiagram';
import {ElementBuilder} from './ElementBuilder';
import {getTypeText} from './ts-utils';

export class FunctionElementBuilder implements ElementBuilder {
  create(declaration: FunctionDeclaration): FunctionElement {
    return new FunctionElement(
      declaration.getName() ?? 'no-name',
      getTypeText(declaration.getReturnType()),
      this.buildParameters(declaration)
    );
  }

  private buildParameters(node: ParameteredNode) {
    return node.getParameters().map(p => ({
      name: p.getName(),
      type: getTypeText(p.getType()),
    }));
  }
}
