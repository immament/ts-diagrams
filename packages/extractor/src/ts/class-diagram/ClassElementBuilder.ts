import {ClassElement} from '@common/ClassDiagram';
import {AccessModifier} from 'common';
import {
  ClassDeclaration,
  GetAccessorDeclaration,
  ModifierableNode,
} from 'ts-morph';
import {getTypeText} from '../utils/ts-utils';
import {ClassLikeElementBuilder} from './ClassLikeElementBuilder';
import {ElementBuilder} from './ElementBuilder';

export class ClassElementBuilder implements ElementBuilder {
  private classLikeElementBuilder = new ClassLikeElementBuilder(
    this.getAccessModifier
  );

  create(declaration: ClassDeclaration) {
    const accessors = this.buildAccessors(declaration);
    const name = declaration.getName();
    const methods = this.classLikeElementBuilder.buildMethods(declaration);
    const properties = this.classLikeElementBuilder.buildProperties(
      declaration
    );

    return new ClassElement(name ?? 'no-name', methods, properties, accessors);
  }

  private buildAccessors(declaration: ClassDeclaration) {
    return declaration.getGetAccessors().map(d => {
      return this.buildAccessor(d);
    });
  }

  private buildAccessor(d: GetAccessorDeclaration) {
    return {
      name: d.getName(),
      type: getTypeText(d.getType()),
      accessModifier: this.getAccessModifier(d),
    };
  }

  protected getAccessModifier(d?: ModifierableNode): AccessModifier {
    const modifier = d
      ?.getModifiers()
      .find(m => ['private', 'protected'].includes(m.getText()));
    return modifier ? (modifier.getText() as AccessModifier) : 'public';
  }
}
