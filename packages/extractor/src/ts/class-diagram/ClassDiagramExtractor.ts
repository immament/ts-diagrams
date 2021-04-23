import {ClassDiagramDTO} from 'common';
import {Project, ProjectOptions, SourceFile} from 'ts-morph';
import {ExtractorProject, ResultStream} from '../ExtractorProject';
import {ClassDiagramBuilder} from './builders/ClassDiagramBuilder';
import {ClassDiagramElementsSearcher} from './ClassDiagramElementsSearcher';
import {ReferenceSearcher} from './ReferenceSearcher';

export type ExtractorOptions = ProjectOptions;

export type DiagramStream = ResultStream<ClassDiagramDTO>;

export class ClassDiagramExtractor {
  private searcher = new ClassDiagramElementsSearcher();
  private builder = new ClassDiagramBuilder();
  private referenceSercher = new ReferenceSearcher();

  constructor(
    private opt: ExtractorOptions,
    private diagramOpt: {
      includeFilesFromDir?: string;
      filesPattern?: string;
    } = {}
  ) {}

  extract({
    directory = '',
    watchOff,
  }: {
    directory?: string;
    watchOff?: boolean;
  }): DiagramStream {
    const extractor = new ExtractorProject(this.opt, this.diagramOpt);
    return extractor.extract({
      srcPath: directory,
      watchOff,
      extractCallback: this.getExtractProcess(directory),
    });
  }

  private getExtractProcess(directory: string) {
    return (project: Project) => {
      const searchedFiles = project.getSourceFiles(
        this.createPathPattern(directory)
      );

      const declarations = searchedFiles.flatMap(sf => this.searchInFile(sf));

      const references = this.referenceSercher.search(declarations);

      return this.builder.create({declarations, references}).toDTO();
    };
  }

  private createPathPattern(directory: string): string {
    return directory + (this.diagramOpt.filesPattern ?? '/**/*.ts');
  }

  private searchInFile(sourceFile: SourceFile) {
    return this.searcher.search(sourceFile);
  }
}
