import {Project} from 'ts-morph';

export function initProject(text: string) {
  const {project, sourceFiles} = initProjectWithFiles([['index.ts', text]]);

  return {project, sourceFile: sourceFiles[0]};
}

export function initProjectWithFiles(files: [string, string][]) {
  const compilerOptions = undefined;
  const project = new Project({compilerOptions, useInMemoryFileSystem: true});

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
