import {ClassDiagramDTO} from 'common';
import {Project, ProjectOptions, SourceFile} from 'ts-morph';
import {ExtractorProject, ResultStream} from '../ExtractorProject';
import {ClassDiagramBuilder} from './ClassDiagramBuilder';
import {Searcher} from './searcher';

export type ExtractorOptions = ProjectOptions;

export class ClassDiagramExtractor {
  private searcher = new Searcher();
  private builder = new ClassDiagramBuilder();

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
  }): ResultStream<ClassDiagramDTO> {
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

      return this.builder.create({declarations}).toDTO();
    };
  }

  private createPathPattern(directory: string): string {
    return directory + (this.diagramOpt.filesPattern ?? '/**/*.ts');
  }

  private searchInFile(sourceFile: SourceFile) {
    return this.searcher.search(sourceFile);
  }
}
