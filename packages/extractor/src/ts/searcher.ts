import {ClassDeclaration, InterfaceDeclaration, SourceFile} from 'ts-morph';

export class Searcher {
  constructor(private opt: {checkOnlyExportKeyword?: boolean} = {}) {}

  private classes: (ClassDeclaration | InterfaceDeclaration)[] = [];

  search(sf: SourceFile) {
    sf.getClasses().forEach(c => {
      this.addClass(c);
    });

    sf.getInterfaces().forEach(c => {
      this.addClass(c);
    });

    return this.classes;
  }

  private addClass(c: ClassDeclaration | InterfaceDeclaration): void {
    // hasExportKeyword  is faster then isExported() but not check aliases
    if (
      this.opt.checkOnlyExportKeyword ? c.hasExportKeyword() : c.isExported()
    ) {
      this.classes.push(c);
    }
  }
}
