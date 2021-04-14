import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Project, ProjectOptions} from 'ts-morph';
import {TsProjectWatcher} from './TsProjectWatcher';

export type ExtractorOptions = ProjectOptions;

export type ResultStream<T> = {
  streams$: Observable<T>;
  close: () => void;
};

export class ExtractorProject {
  constructor(
    private opt: ExtractorOptions,
    private diagramOpt: {
      includeFilesFromDir?: string;
      filesPattern?: string;
    } = {}
  ) {}

  extract<T>({
    srcPath = '',
    watchOff,
    extractCallback,
  }: {
    srcPath?: string;
    watchOff?: boolean;
    extractCallback: (project: Project) => T;
  }): ResultStream<T> {
    const watcher = this.createTsProjectWatcher(
      this.opt,
      srcPath,
      this.diagramOpt.filesPattern ?? '/**/*.ts',
      watchOff
    );

    return {
      streams$: watcher.projectChanges$.pipe(
        map(data => {
          if (data.eventType === 'init') this.includeFiles(data.project);
          return extractCallback(data.project);
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
}
