import {ExportGetableNode, Node, SourceFile} from 'ts-morph';

export class Searcher {
  constructor(private opt: {checkOnlyExportKeyword?: boolean} = {}) {}

  private foundNodes: Node[] = [];

  search(sf: SourceFile) {
    sf.getClasses().forEach(c => {
      this.addExportableNode(c);
    });

    sf.getInterfaces().forEach(c => {
      this.addExportableNode(c);
    });

    sf.getFunctions().forEach(c => {
      this.addExportableNode(c);
    });

    return this.foundNodes;
  }

  private addExportableNode(c: ExportGetableNode & Node): void {
    // hasExportKeyword  is faster then isExported() but not check aliases
    if (
      this.opt.checkOnlyExportKeyword ? c.hasExportKeyword() : c.isExported()
    ) {
      this.foundNodes.push(c);
    }
  }
}
