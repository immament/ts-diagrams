import {FunctionElement} from '@common/ClassDiagram';
import {FunctionDeclaration, ParameteredNode} from 'ts-morph';
import {getTypeText} from '../../utils/ts-utils';
import {ElementBuilder} from './ElementBuilder';

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
