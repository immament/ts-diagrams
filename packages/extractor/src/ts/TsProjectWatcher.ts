import {IDisposable} from '@common/IDisposable';
import * as chokidar from 'chokidar';
import * as path from 'path';
import {BehaviorSubject, Observable} from 'rxjs';
import {Project, ProjectOptions} from 'ts-morph';

export type EventType =
  | 'init'
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir';

export type WatchEvent = {
  type: EventType;
  path: string;
};

type TsProjectWatcherOptions = {
  srcPath: string;
  filesPattern?: string;
  onReady?: () => void;
  projectOptions?: ProjectOptions;
  watchOff?: boolean;
};

type ProjectChangeEventData = {
  project: Project;
  eventType: EventType;
};

export class TsProjectWatcher implements IDisposable {
  private _project: Project;
  private projectChangesSubject: BehaviorSubject<ProjectChangeEventData>;
  private _projectChanges$: Observable<ProjectChangeEventData>;

  private watcher?: chokidar.FSWatcher;

  constructor(options: TsProjectWatcherOptions) {
    this._project = new Project(options.projectOptions);
    this.projectChangesSubject = new BehaviorSubject({
      project: this._project,
      eventType: 'init' as EventType,
    });
    this._projectChanges$ = this.projectChangesSubject.asObservable();

    if (!options.watchOff) {
      this.watcher = this.createWatcher(options);
    }
  }

  private createWatcher(options: TsProjectWatcherOptions) {
    const srcFilesPattern = path.join(
      options.srcPath,
      options.filesPattern ?? '/**/*.ts'
    );

    const watcher = chokidar.watch(srcFilesPattern, {
      ignoreInitial: true,
    });

    if (options.onReady) watcher.once('ready', options.onReady);

    watcher.on('all', (eventName, path) => {
      this.mapEvent({type: eventName, path});
    });

    return watcher;
  }

  get projectChanges$() {
    return this._projectChanges$;
  }

  dispose() {
    return this.watcher?.close() || Promise.resolve();
  }

  private mapEvent(e: WatchEvent) {
    switch (e.type) {
      case 'add':
        this._project.addSourceFileAtPathIfExists(e.path);
        break;
      case 'change':
        this._project.getSourceFile(e.path)?.refreshFromFileSystemSync();
        break;
      case 'unlink':
        {
          const sourceFile = this._project.getSourceFile(e.path);
          if (sourceFile) {
            this._project.removeSourceFile(sourceFile);
          }
        }
        break;

      default:
        throw Error('Not implemented event type:' + e.type);
    }

    this.projectChangesSubject.next({
      project: this._project,
      eventType: e.type,
    });
  }
}
