import {Project, ProjectOptions} from 'ts-morph';

export function initProject(text: string, opt: ProjectOptions = {}) {
  const {project, sourceFiles} = initProjectWithFiles(
    [['index.ts', text]],
    opt
  );

  return {project, sourceFile: sourceFiles[0]};
}

export function initProjectWithFiles(
  files: [string, string][],
  opt: ProjectOptions = {}
) {
  const compilerOptions = {
    lib: ['lib.es2015.d.ts'],
  };
  const project = new Project({
    compilerOptions,
    useInMemoryFileSystem: true,
    skipLoadingLibFiles: opt.skipLoadingLibFiles ?? true,
  });

  const sourceFiles = files.map(([name, content]) =>
    project.createSourceFile(name, content)
  );

  const [[firstFileName]] = files;

  return {
    project,
    sourceFiles,
    firstFile: project.getSourceFile(firstFileName),
  };
}
