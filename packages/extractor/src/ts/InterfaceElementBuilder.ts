import {InterfaceDeclaration} from 'ts-morph';
import {AccessModifier, InterfaceElement} from '../result/ClassDiagram';
import {ClassLikeElementBuilder} from './ClassLikeElementBuilder';
import {ElementBuilder} from './ElementBuilder';

export class InterfaceElementBuilder implements ElementBuilder {
  private classLikeElementBuilder = new ClassLikeElementBuilder(
    this.getAccessModifier
  );

  create(declaration: InterfaceDeclaration) {
    const name = declaration.getName();
    const methods = this.classLikeElementBuilder.buildMethods(declaration);
    const properties = this.classLikeElementBuilder.buildProperties(
      declaration
    );

    return new InterfaceElement(name ?? 'no-name', methods, properties);
  }

  protected getAccessModifier(): AccessModifier {
    return 'public';
  }
}
