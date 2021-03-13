import {ClassDeclaration, SourceFile} from 'ts-morph';

export class Searcher {
  constructor(private opt: {checkOnlyExportKeyword?: boolean} = {}) {}

  private classes: ClassDeclaration[] = [];

  search(sf: SourceFile) {
    sf.getClasses().forEach(c => {
      this.addClass(c);
    });
    return this.classes;
  }

  private addClass(c: ClassDeclaration): void {
    // hasExportKeyword  is faster then isExported() but not check aliases
    if (
      this.opt.checkOnlyExportKeyword ? c.hasExportKeyword() : c.isExported()
    ) {
      this.classes.push(c);
    }
  }
}
