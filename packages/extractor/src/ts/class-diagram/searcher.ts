import {ExportGetableNode, Node, SourceFile} from 'ts-morph';

export class Searcher {
  constructor(private opt: {checkOnlyExportKeyword?: boolean} = {}) {}

  search(sf: SourceFile) {
    const foundNodes: Node[] = [];
    sf.getClasses().forEach(c => {
      this.addExportableNode(c, foundNodes);
    });

    sf.getInterfaces().forEach(c => {
      this.addExportableNode(c, foundNodes);
    });

    sf.getFunctions().forEach(c => {
      this.addExportableNode(c, foundNodes);
    });

    sf.getVariableDeclarations().forEach(c => {
      this.addExportableNode(c, foundNodes);
    });

    return foundNodes;
  }

  private addExportableNode(
    c: ExportGetableNode & Node,
    foundNodes: Node[]
  ): void {
    // hasExportKeyword  is faster then isExported() but not check aliases
    if (
      this.opt.checkOnlyExportKeyword ? c.hasExportKeyword() : c.isExported()
    ) {
      foundNodes.push(c);
    }
  }
}
