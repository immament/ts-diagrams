import * as fs from 'fs';
import * as path from 'path';
import {Subscription} from 'rxjs';
import {TsProjectWatcher} from '../TsProjectWatcher';

jest.unmock('chokidar');

describe('TsProjectWatcher', () => {
  const srcPath = path.join(__dirname, 'watch-test-dir');
  const filesPattern = '/*.ts';
  const testFilePath = path.join(srcPath, 'tsProjectWatcher.ts');

  test('should add new file to project', done => {
    const projectWatcher = createTsProjectWatcher();

    const subsc = projectWatcher.projectChanges$.subscribe(data => {
      if (data.eventType === 'add') {
        expect(data.project.getSourceFiles().length).toBe(1);
        cleanUp(projectWatcher, done, subsc);
      }
    });
  });

  test('should update new file in project', done => {
    const projectWatcher = createTsProjectWatcher();

    const subsc = projectWatcher.projectChanges$.subscribe(data => {
      switch (data.eventType) {
        case 'add':
          writeTestFile('const i = 1;');
          break;
        case 'change':
          expect(
            data.project
              .getSourceFile(testFilePath)
              ?.getVariableDeclaration('i')
          ).toBeDefined();

          cleanUp(projectWatcher, done, subsc);

          break;
      }
    });
  });

  test('should remove deleted file from project', done => {
    const projectWatcher = createTsProjectWatcher();

    const subsc = projectWatcher.projectChanges$.subscribe(data => {
      if (data.eventType === 'unlink') {
        expect(data.project.getSourceFiles().length).toBe(0);
        cleanUp(projectWatcher, done, subsc);
      } else if (data.eventType === 'add') {
        fs.rmSync(testFilePath);
      }
    });
  });

  afterEach(() => {
    fs.rmSync(testFilePath, {force: true});
  });

  function createTsProjectWatcher() {
    return new TsProjectWatcher({
      srcPath,
      filesPattern,
      onReady: () => {
        fs.writeFileSync(testFilePath, '// new', {encoding: 'utf-8'});
      },
      projectOptions: {skipLoadingLibFiles: true},
    });
  }

  function writeTestFile(content: string) {
    fs.writeFileSync(testFilePath, content, {
      encoding: 'utf-8',
    });
  }

  function cleanUp(
    projectWatcher: TsProjectWatcher,
    done: jest.DoneCallback,
    subsc: Subscription
  ) {
    projectWatcher.dispose().then(() => {
      done();
    });
    subsc.unsubscribe();
  }
});
