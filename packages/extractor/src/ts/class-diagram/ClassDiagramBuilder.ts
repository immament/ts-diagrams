import {ClassDiagram, ClassLikeElement} from '@common/ClassDiagram';
import {Node, ts} from 'ts-morph';
import {ClassElementBuilder} from './ClassElementBuilder';
import {ElementBuilder} from './ElementBuilder';
import {FunctionElementBuilder} from './FunctionElementBuilder';
import {InterfaceElementBuilder} from './InterfaceElementBuilder';
import {VariableElementBuilder} from './VariableElementBuilder';

interface BuilderConstructor {
  new (): ElementBuilder;
}

export class ClassDiagramBuilder {
  private elementBuilderMapper = new Map<ts.SyntaxKind, BuilderConstructor>([
    [ts.SyntaxKind.ClassDeclaration, ClassElementBuilder],
    [ts.SyntaxKind.InterfaceDeclaration, InterfaceElementBuilder],
    [ts.SyntaxKind.FunctionDeclaration, FunctionElementBuilder],
    [ts.SyntaxKind.VariableDeclaration, VariableElementBuilder],
  ]);

  create({declarations}: {declarations: Node[]}) {
    const elements = declarations
      .map(d => {
        const elementBuilder = this.elementBuilderMapper.get(d.getKind());
        if (elementBuilder) return new elementBuilder().create(d);

        throw new Error(`No builder for ${d.getKindName()}(${d.getKind()})`);
      })
      .filter(e => !!e);
    const diagram = new ClassDiagram(elements as ClassLikeElement[]);
    return diagram;
  }
}
