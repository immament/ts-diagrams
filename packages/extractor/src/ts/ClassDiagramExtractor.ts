import {Project, ProjectOptions, SourceFile} from 'ts-morph';
import {ClassDiagramBuilder} from './ClassDiagramBuilder';
import {Searcher} from './searcher';

export class ClassDiagramExtractor {
  private searcher = new Searcher();
  private builder = new ClassDiagramBuilder();

  constructor(
    private opt: ProjectOptions,
    private diagramOpt: {diagramSrc?: string; files?: string} = {}
  ) {}

  extract({directory = ''}: {directory?: string}) {
    const project = this.initProject(this.opt);

    if (this.diagramOpt.diagramSrc) {
      const srcFilesPath =
        this.diagramOpt.diagramSrc + (this.diagramOpt.files ?? '/**/*.ts');
      project.addSourceFilesAtPaths(srcFilesPath);
    }

    const searchedFiles = project.getSourceFiles(
      directory + (this.diagramOpt.files ?? '/**/*.ts')
    );

    const declarations = searchedFiles.flatMap(sf => this.searchInFile(sf));

    return this.builder.create({declarations});
  }

  private initProject(opt: ProjectOptions = {}) {
    return new Project(opt);
  }

  searchInFile(sourceFile: SourceFile) {
    return this.searcher.search(sourceFile);
  }
}
