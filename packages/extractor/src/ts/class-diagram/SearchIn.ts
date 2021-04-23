import {ClassDeclaration, InterfaceDeclaration, Node} from 'ts-morph';
import {ReferenceSearcherContext} from './ReferenceSearcherContext';

export interface SearchIn {
  search(context: ReferenceSearcherContext, node: Node): Node[];
}

export class SearchInInterface implements SearchIn {
  search(context: ReferenceSearcherContext, node: InterfaceDeclaration) {
    node.getExtends().forEach(im => {
      context.addIRef(im.getExpression(), context, 'extends');
    });

    // .forEach(ext => {
    //   const declarations = ext.getExpression().getSymbol()?.getDeclarations();
    //   if (declarations?.length) {
    //     ensureHasOneDeclaration(declarations);
    //     context.addRefFromCurrentNode(declarations[0], ext, 'extends');
    //   }
    // });
    return node.getMembers();
  }
}

export class SearchInClass implements SearchIn {
  search(context: ReferenceSearcherContext, node: ClassDeclaration) {
    this.addBaseType(node, context);
    this.addImplements(node, context);
    this.addProperties(node, context);

    return node.getMembers();
  }

  private addImplements(
    node: ClassDeclaration,
    context: ReferenceSearcherContext
  ) {
    node
      .getImplements()
      .forEach(im =>
        context.addIRef(im.getExpression(), context, 'implements')
      );
  }

  private addProperties(
    node: ClassDeclaration,
    context: ReferenceSearcherContext
  ) {
    node.getProperties().forEach(prop => {
      const symbol = prop.getType()?.getSymbol();
      if (symbol) {
        const item = context.getItem(symbol);
        if (item) {
          const refNode = prop
            .getTypeNode()
            ?.getChildren()
            .find(n => Node.isIdentifier(n));

          context.addRefFromCurrentNode(
            item,
            refNode ?? prop.getTypeNode()!,
            'association'
          );
        }
      }
    });
  }

  private addBaseType(
    node: ClassDeclaration,
    context: ReferenceSearcherContext
  ) {
    //console.log(prepareToPrintNode(node), Node.isClassDeclaration(node));

    const base = node.getBaseClass();
    base && context.addRefFromCurrentNode(base, base, 'extends');
  }
}
