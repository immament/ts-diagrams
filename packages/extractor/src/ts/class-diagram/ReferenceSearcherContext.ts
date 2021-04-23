import {Node, Symbol} from 'ts-morph';
import {Cache} from '../utils/Cache';
import {Reference} from './ReferenceSearcher';

export class ReferenceSearcherContext {
  private cache = new Cache<Symbol, Node>();

  private references: Reference[] = [];
  private currentNode?: Node;

  constructor(nodes: Node[]) {
    this.fillNodeCache(nodes);
  }

  addRefFromCurrentNode(from: Node, refNode: Node, type: string) {
    if (this.currentNode && this.references.every(r => r.refNode !== refNode)) {
      this.references.push({from: this.currentNode, to: from, type, refNode});
    }
  }

  addIRef(node: Node, context: ReferenceSearcherContext, type: string) {
    const item = context.getItemForNode(node);
    //console.log('addIRef', prepareToPrintNode([item, node]));
    if (item) {
      context.addRefFromCurrentNode(item, node, type);
    }
  }

  getReferences() {
    return this.references;
  }

  setCurrentNode(node: Node) {
    this.currentNode = node;
  }

  getItem(symbol: Symbol): Node | undefined {
    const item = this.cache.get(symbol);
    if (item && !this.isCurrentNode(item)) return item;
    return;
  }

  getItemForNode(node: Node): Node | undefined {
    let symbol = node.getSymbol();
    while (symbol && symbol.isAlias()) {
      symbol = symbol.getAliasedSymbol();
    }
    return symbol && this.getItem(symbol);
  }

  // isItem(node: Node): boolean {
  //   return this.nodes.some(n => n === node);
  // }

  private isCurrentNode(node: Node): boolean {
    return node === this.currentNode;
  }

  private fillNodeCache(nodes: Node[]) {
    nodes.forEach(n => {
      const symbol = n.getSymbol();
      symbol && this.cache.set(symbol, n);
    });
  }
}
