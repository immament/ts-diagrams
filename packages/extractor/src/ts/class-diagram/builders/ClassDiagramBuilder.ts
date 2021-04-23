import {ClassDiagram, DiagramElement} from '@common/ClassDiagram';
import {Node, ts} from 'ts-morph';
import {ExtractorError} from '../../../common/TsError';
import {Reference} from '../ReferenceSearcher';
import {ClassElementBuilder} from './ClassElementBuilder';
import {ElementBuilder} from './ElementBuilder';
import {FunctionElementBuilder} from './FunctionElementBuilder';
import {InterfaceElementBuilder} from './InterfaceElementBuilder';
import {LinksBuilder} from './LinksBuilder';
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

  create({
    declarations,
    references,
  }: {
    declarations: Node[];
    references?: Reference[];
  }) {
    const nodeToElements = this.createElements(declarations);

    const links = references
      ? this.createLinks(nodeToElements, references)
      : [];

    // console.log('links', links);

    const diagram = new ClassDiagram(
      nodeToElements.map(([, el]) => el),
      links
    );
    return diagram;
  }

  createLinks(elements: [Node, DiagramElement][], references: Reference[]) {
    const elementsMap = new WeakMap(elements);
    const builder = new LinksBuilder(elementsMap);
    return references.map(r => builder.create(r));
  }

  private createElements(declarations: Node[]): [Node, DiagramElement][] {
    return declarations.map(node => {
      const elementBuilder = this.elementBuilderMapper.get(node.getKind());
      if (elementBuilder) {
        return [node, new elementBuilder().create(node)];
      }

      throw new ExtractorError(
        `No builder for ${node.getKindName()}(${node.getKind()})`
      );
    });
  }
}
