import {Node, ts} from 'ts-morph';
import {ClassDiagram, ClassLikeElement} from '../result/ClassDiagram';
import {ClassElementBuilder} from './ClassElementBuilder';
import {ElementBuilder} from './ElementBuilder';
import {FunctionElementBuilder} from './FunctionElementBuilder';
import {InterfaceElementBuilder} from './InterfaceElementBuilder';

interface BuilderConstructor {
  new (): ElementBuilder;
}

export class ClassDiagramBuilder {
  private elementBuilderMapper = new Map<ts.SyntaxKind, BuilderConstructor>([
    [ts.SyntaxKind.ClassDeclaration, ClassElementBuilder],
    [ts.SyntaxKind.InterfaceDeclaration, InterfaceElementBuilder],
    [ts.SyntaxKind.FunctionDeclaration, FunctionElementBuilder],
  ]);

  create({declarations}: {declarations: Node[]}) {
    const elements = declarations
      .map(cd => {
        const builder = this.elementBuilderMapper.get(cd.getKind());
        return builder && new builder().create(cd);

        // TODO: default builder
      })
      .filter(e => !!e);
    const diagram = new ClassDiagram(elements as ClassLikeElement[]);
    return diagram;
  }
}
