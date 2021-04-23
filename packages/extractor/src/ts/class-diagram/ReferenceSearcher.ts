import {Node, SyntaxKind} from 'ts-morph';
import {ReferenceSearcherContext} from './ReferenceSearcherContext';
import {SearchIn, SearchInClass, SearchInInterface} from './SearchIn';

export type Reference = {from: Node; to: Node; type: string; refNode: Node};

export class ReferenceSearcher {
  private searchInKind: Partial<Record<SyntaxKind, SearchIn>> = {
    [SyntaxKind.ClassDeclaration]: new SearchInClass(),
    [SyntaxKind.InterfaceDeclaration]: new SearchInInterface(),
  };

  search(nodes: Node[]) {
    return nodes
      .reduce((context, node) => {
        context.setCurrentNode(node);
        this.searchIn(context, node, this.getSearchInStrategy(node));
        return context;
      }, new ReferenceSearcherContext(nodes))
      .getReferences();
  }

  private searchIn(
    context: ReferenceSearcherContext,
    node: Node,
    searchInStrategy?: SearchIn
  ) {
    if (searchInStrategy) {
      const childsToSearch = searchInStrategy.search(context, node);
      childsToSearch.forEach(m => this.searchInsideNode(context, m));
    } else {
      node.forEachChild(child => this.searchInsideNode(context, child));
    }
  }

  private getSearchInStrategy(node: Node) {
    return this.searchInKind[node.getKind()];
  }

  private searchInsideNode(context: ReferenceSearcherContext, node: Node) {
    const connectedNode = context.getItemForNode(node);

    if (connectedNode) {
      context.addRefFromCurrentNode(connectedNode, node, 'use');
      return;
    }

    node.forEachChild(child => this.searchInsideNode(context, child));
  }
}
