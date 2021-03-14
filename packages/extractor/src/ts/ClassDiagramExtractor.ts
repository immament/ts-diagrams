import {Project, ProjectOptions, SourceFile} from 'ts-morph';
import {ClassDiagramBuilder} from './ClassDiagramBuilder';
import {Searcher} from './searcher';

export class ClassDiagramExtractor {
  private searcher = new Searcher({checkOnlyExportKeyword: true});
  private builder = new ClassDiagramBuilder();

  constructor(private opt: ProjectOptions) {}

  extract({directory}: {directory: string}) {
    const project = this.initProject(this.opt);

    const declarations = project
      .getSourceFiles(directory + '/**/*.ts')
      .flatMap(sf => this.searchInFile(sf));

    return this.builder.create({declarations});
  }

  private initProject(opt: ProjectOptions = {}) {
    return new Project(opt);
  }

  searchInFile(sourceFile: SourceFile) {
    return this.searcher.search(sourceFile);
  }
}
