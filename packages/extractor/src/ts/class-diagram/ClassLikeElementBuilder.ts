import {
  ClassDeclaration,
  InterfaceDeclaration,
  MethodDeclaration,
  MethodSignature,
  ModifierableNode,
  ParameteredNode,
  PropertyDeclaration,
  PropertySignature,
} from 'ts-morph';
import {AccessModifier, Method, Property} from '../../result/ClassDiagram';
import {getTypeText} from '../utils/ts-utils';

export class ClassLikeElementBuilder {
  constructor(
    private getAccessModifier: (p?: ModifierableNode) => AccessModifier
  ) {}

  buildMethods(declaration: InterfaceDeclaration | ClassDeclaration): Method[] {
    return declaration
      .getMethods()
      .map((md: MethodSignature | MethodDeclaration) => this.buildMethod(md));
  }

  private buildMethod(md: MethodSignature | MethodDeclaration): Method {
    return {
      name: md.getName(),
      returnType: getTypeText(md.getReturnType()),
      parameters: this.buildParameters(md),
      accessModifier: this.getAccessModifier(md as ModifierableNode),
    };
  }

  private buildParameters(node: ParameteredNode) {
    return node.getParameters().map(p => ({
      name: p.getName(),
      type: getTypeText(p.getType()),
    }));
  }

  buildProperties(declaration: ClassDeclaration | InterfaceDeclaration) {
    return declaration
      .getProperties()
      .map((d: PropertyDeclaration | PropertySignature) =>
        this.buildProperty(d)
      );
  }

  private buildProperty(d: PropertyDeclaration | PropertySignature): Property {
    return {
      name: d.getName(),
      type: getTypeText(d.getType()),
      accessModifier: this.getAccessModifier(d),
    };
  }
}
