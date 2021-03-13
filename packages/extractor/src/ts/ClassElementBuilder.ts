import {
  ClassDeclaration,
  GetAccessorDeclaration,
  MethodDeclaration,
  PropertyDeclaration,
} from 'ts-morph';
import {
  AccessModifier,
  Accessor,
  ClassElement,
  Method,
  Property,
} from '../result/ClassDiagram';
import {getTypeText} from './ts-utils';

export class ClassElementBuilder {
  private methods?: Method[];
  private properties?: Property[];
  accessors?: Accessor[];

  create(classDeclaration: ClassDeclaration) {
    this.methods = this.buildMethods(classDeclaration);
    this.accessors = this.buildAccessors(classDeclaration);
    this.properties = this.buildProperties(classDeclaration);

    const element = new ClassElement(
      this.methods ?? [],
      this.properties ?? [],
      this.accessors ?? []
    );

    return element;
  }

  protected buildMethods(classDeclaration: ClassDeclaration): Method[] {
    return classDeclaration.getMethods().map(md => this.buildMethod(md));
  }

  private buildMethod(
    md: MethodDeclaration
  ): {
    name: string;
    returnType: string;
    parameters: {name: string; type: string}[];
    accessModifier: AccessModifier;
  } {
    return {
      name: md.getName(),
      returnType: getTypeText(md.getReturnType()),
      parameters: this.buildParameters(md),
      accessModifier: this.getAccessModifier(md),
    };
  }

  private buildParameters(md: MethodDeclaration) {
    return md.getParameters().map(p => ({
      name: p.getName(),
      type: getTypeText(p.getType()),
    }));
  }

  private getAccessModifier(
    d: MethodDeclaration | PropertyDeclaration | GetAccessorDeclaration
  ): AccessModifier {
    const modifier = d
      .getModifiers()
      .find(m => ['private', 'protected'].includes(m.getText()));
    return modifier ? (modifier.getText() as AccessModifier) : 'public';
  }

  private buildProperties(classDeclaration: ClassDeclaration) {
    return classDeclaration.getProperties().map(d => this.buildProperty(d));
  }

  private buildProperty(d: PropertyDeclaration): Property {
    return {
      name: d.getName(),
      type: getTypeText(d.getType()),
      accessModifier: this.getAccessModifier(d),
    };
  }

  private buildAccessors(classDeclaration: ClassDeclaration) {
    return classDeclaration.getGetAccessors().map(d => {
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
}
