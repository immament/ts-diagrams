import {ClassDiagramDTO} from 'common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Project, ProjectOptions, SourceFile} from 'ts-morph';
import {TsProjectWatcher} from '../TsProjectWatcher';
import {ClassDiagramBuilder} from './ClassDiagramBuilder';
import {Searcher} from './searcher';

export type ExtractorOptions = ProjectOptions;

export type DiagramStream = {
  diagrams$: Observable<ClassDiagramDTO>;
  close: () => void;
};

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
  }): DiagramStream {
    const watcher = this.createTsProjectWatcher(
      this.opt,
      directory,
      this.diagramOpt.filesPattern ?? '/**/*.ts',
      watchOff
    );

    return {
      diagrams$: watcher.projectChanges$.pipe(
        map(data => {
          if (data.eventType === 'init') this.includeFiles(data.project);
          return this.process(data.project, directory);
        })
      ),
      close: () => {
        watcher.dispose();
      },
    };
  }

  private includeFiles(project: Project) {
    if (this.diagramOpt.includeFilesFromDir) {
      const srcFilesPath =
        this.diagramOpt.includeFilesFromDir +
        (this.diagramOpt.filesPattern ?? '/**/*.ts');
      project.addSourceFilesAtPaths(srcFilesPath);
    }
  }

  private process(project: Project, directory: string) {
    const searchedFiles = project.getSourceFiles(
      this.createPathPattern(directory)
    );

    const declarations = searchedFiles.flatMap(sf => this.searchInFile(sf));

    return this.builder.create({declarations}).toDTO();
  }

  private createTsProjectWatcher(
    projectOptions: ProjectOptions,
    srcPath: string,
    filesPattern: string,
    watchOff?: boolean
  ) {
    return new TsProjectWatcher({
      srcPath,
      filesPattern,
      projectOptions,
      watchOff,
    });
  }

  private createPathPattern(directory: string): string {
    return directory + (this.diagramOpt.filesPattern ?? '/**/*.ts');
  }

  private searchInFile(sourceFile: SourceFile) {
    return this.searcher.search(sourceFile);
  }
}
